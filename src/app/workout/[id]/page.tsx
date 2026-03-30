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

const WorkoutPage = () => {
  useRestoreCurrentCourse();
  useRestoreCurrentWorkout();
  useRestoreCurrentProgressWorkout();

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { access } = useAppSelector((state) => state.auth);
  const { currentCourse, currentWorkout, currentProgressWorkout } =
    useAppSelector((state) => state.courses);
  const { parseExerciseName } = useParseExerciseName();
  const { status, buttonText } = useProgressStatus(
    currentWorkout,
    currentProgressWorkout,
  );

  const [loading, setLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  useEffect(() => {
    if (!access || !id || !currentCourse) return;

    const workoutId = Array.isArray(id) ? id[0] : id;

    Promise.all([
      getDataWorkout(access, workoutId),
      getProgressWorkout(access, currentCourse._id, workoutId),
    ])
      .then(([workoutRes, progressRes]) => {
        dispatch(setCurrentWorkout(workoutRes.data));

        if (progressRes.data.progressData) {
          const progressMap: Record<string, number> = {};
          workoutRes.data.exercises?.forEach(
            (exercise: Exercise, index: number) => {
              progressMap[exercise._id] =
                progressRes.data.progressData[index] || 0;
            },
          );
          dispatch(setCurrentProgressWorkout(progressMap));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [access, id, currentCourse, dispatch]);

  const handleFillProgress = async () => {
    if (!access) {
      alert("Авторизуйтесь");
      return;
    }

    if (status === "restart") {
      const workoutId = Array.isArray(id) ? id[0] : id;
      if (!workoutId || !currentCourse || !currentWorkout) return;

      try {
        await clearProgressWorkout(access, currentCourse._id, workoutId);

        const clearedProgress: Record<string, number> = {};
        currentWorkout.exercises?.forEach((exercise) => {
          clearedProgress[exercise._id] = 0;
        });
        dispatch(setCurrentProgressWorkout(clearedProgress));
        alert("Прогресс сброшен");
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
      alert("Прогресс сохранен");
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
              <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>

              <div className={styles.exercisesList}>
                {currentWorkout.exercises?.map((exercise) => {
                  const completed = currentProgressWorkout?.[exercise._id] || 0;
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
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className={styles.fillButton} onClick={handleFillProgress}>
              {buttonText}
            </button>
          </div>
        </div>
      </main>

      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        exercises={currentWorkout.exercises || []}
        onSave={handleSaveProgress}
      />
    </>
  );
};

export default WorkoutPage;
