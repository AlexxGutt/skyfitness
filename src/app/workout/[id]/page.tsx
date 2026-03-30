"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";
import {
  changeProgressWorkout,
  clearProgressWorkout,
  getDataWorkout,
} from "@/service/api/apiWorkout";
import { getProgressWorkout } from "@/service/api/apiWorkout";
import { useParseExerciseName } from "@/hooks/useParseExerciseName";
import { useProgressStatus } from "@/hooks/useProgressStatus";
import ProgressModal, { Exercise } from "@/components/Modal/ProgressModal";
import { useRestoreCurrentCourse } from "@/hooks/useRestoreCurrentCourse";
import { useRestoreCurrentWorkout } from "@/hooks/useRestoreCurrentWorkout";
import { useRestoreCurrentProgressWorkout } from "@/hooks/useRestoreCurrentProgressWorkout";
import {
  setCurrentWorkout,
  setCurrentProgressWorkout,
} from "@/store/features/courseSlice";
import { CourseProgress, WorkoutProgress } from "@/sharedTypes/sharedTypes";

const WorkoutPage = () => {
  useRestoreCurrentCourse();
  useRestoreCurrentWorkout();
  useRestoreCurrentProgressWorkout();

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { access } = useAppSelector((state) => state.auth);
  const { currentCourse, currentWorkout, currentProgressWorkout, usersCourse } =
    useAppSelector((state) => state.courses);
  const { parseExerciseName } = useParseExerciseName();
  const { status, buttonText } = useProgressStatus(
    currentWorkout,
    currentProgressWorkout,
  );

  const [loading, setLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const isVideoOnly =
    !currentWorkout?.exercises || currentWorkout.exercises.length === 0;
  const videoProgress = currentProgressWorkout?.video || 0;

  useEffect(() => {
    if (!access || !id || !currentCourse) return;

    const workoutId = Array.isArray(id) ? id[0] : id;

    Promise.all([
      getDataWorkout(access, workoutId),
      getProgressWorkout(access, currentCourse._id, workoutId),
    ])
      .then(([workoutRes, progressRes]) => {
        dispatch(setCurrentWorkout(workoutRes.data));

        const isVideoOnlyWorkout =
          !workoutRes.data.exercises || workoutRes.data.exercises.length === 0;

        if (progressRes.data.progressData) {
          if (isVideoOnlyWorkout) {
            const courseProgress = usersCourse?.courseProgress?.find(
              (cp: CourseProgress) => cp.courseId === currentCourse._id,
            );
            const workoutProgress = courseProgress?.workoutsProgress?.find(
              (wp: WorkoutProgress) => wp.workoutId === workoutId,
            );

            const videoProgress = workoutProgress?.workoutCompleted ? 100 : 0;
            dispatch(setCurrentProgressWorkout({ video: videoProgress }));
          } else {
            const progressMap: Record<string, number> = {};
            workoutRes.data.exercises?.forEach(
              (exercise: Exercise, index: number) => {
                progressMap[exercise._id] =
                  progressRes.data.progressData[index] || 0;
              },
            );
            dispatch(setCurrentProgressWorkout(progressMap));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [access, id, currentCourse, usersCourse, dispatch]);

  const handleFillProgress = async () => {
    if (!access) {
      alert("Авторизуйтесь");
      return;
    }

    if (isVideoOnly && videoProgress === 100) {
      const workoutId = Array.isArray(id) ? id[0] : id;
      if (!workoutId || !currentCourse) return;

      try {
        await clearProgressWorkout(access, currentCourse._id, workoutId);
        dispatch(setCurrentProgressWorkout({ video: 0 }));
      } catch (err) {
        console.error("Failed to clear progress:", err);
        alert("Ошибка при сбросе прогресса");
      }
      return;
    }

    if (!isVideoOnly && status === "restart") {
      const workoutId = Array.isArray(id) ? id[0] : id;
      if (!workoutId || !currentCourse || !currentWorkout) return;

      try {
        await clearProgressWorkout(access, currentCourse._id, workoutId);
        const clearedProgress: Record<string, number> = {};
        currentWorkout.exercises?.forEach((exercise) => {
          clearedProgress[exercise._id] = 0;
        });
        dispatch(setCurrentProgressWorkout(clearedProgress));
      } catch (err) {
        console.error("Failed to clear progress:", err);
        alert("Ошибка при сбросе прогресса");
      }
      return;
    }

    setIsProgressModalOpen(true);
  };

  const handleSaveProgress = async (progressData: Record<string, number>) => {
    if (!access || !currentCourse || !currentWorkout) return;

    const workoutId = Array.isArray(id) ? id[0] : id;
    if (!workoutId) return;

    if (isVideoOnly) {
      try {
        await changeProgressWorkout(access, currentCourse._id, workoutId, {
          progressData: [],
        });

        dispatch(setCurrentProgressWorkout({ video: progressData.video || 0 }));
        setIsProgressModalOpen(false);
      } catch (err) {
        console.error("Failed to save progress:", err);
        alert("Ошибка при сохранении прогресса");
      }
      return;
    }

    const mergedProgress: Record<string, number> = {};
    currentWorkout.exercises?.forEach((exercise) => {
      if (
        progressData[exercise._id] !== undefined &&
        progressData[exercise._id] !== 0
      ) {
        mergedProgress[exercise._id] = progressData[exercise._id];
      } else {
        mergedProgress[exercise._id] =
          currentProgressWorkout?.[exercise._id] || 0;
      }
    });

    const progressArray =
      currentWorkout.exercises?.map((exercise) => {
        return mergedProgress[exercise._id] || 0;
      }) || [];

    try {
      await changeProgressWorkout(access, currentCourse._id, workoutId, {
        progressData: progressArray,
      });

      dispatch(setCurrentProgressWorkout(mergedProgress));
      setIsProgressModalOpen(false);
    } catch (err) {
      console.error("Failed to save progress:", err);
      alert("Ошибка при сохранении прогресса");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </main>
      </>
    );
  }

  if (!currentWorkout) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.loading}>Тренировка не найдена</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {currentCourse?.nameRU || currentWorkout.name}
          </h1>

          <iframe
            className={styles.videoFrame}
            src={currentWorkout.video}
            title={currentWorkout.name}
            allowFullScreen
          />

          <div className={styles.exercisesCard}>
            <div className={styles.exercisesBlock}>
              <h2 className={styles.exercisesTitle}>
                {isVideoOnly ? "Видеоурок" : "Упражнения тренировки"}
              </h2>

              <div className={styles.exercisesList}>
                {isVideoOnly ? (
                  <div className={styles.exerciseItem}>
                    <div className={styles.exerciseName}>
                      Просмотрено {videoProgress}%
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  currentWorkout.exercises?.map((exercise) => {
                    const completed =
                      currentProgressWorkout?.[exercise._id] || 0;
                    const percentage = Math.min(
                      Math.round((completed / exercise.quantity) * 100),
                      100,
                    );
                    return (
                      <div key={exercise._id} className={styles.exerciseItem}>
                        <div className={styles.exerciseName}>
                          {parseExerciseName(exercise.name)} {percentage}%
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <button className={styles.fillButton} onClick={handleFillProgress}>
              {isVideoOnly
                ? videoProgress === 100
                  ? "Сбросить прогресс"
                  : "Отметить просмотр"
                : buttonText}
            </button>
          </div>
        </div>
      </main>

      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        exercises={currentWorkout.exercises || []}
        isVideoOnly={isVideoOnly}
        onSave={handleSaveProgress}
      />
    </>
  );
};

export default WorkoutPage;
