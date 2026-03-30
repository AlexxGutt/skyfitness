"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";
import { getDataWorkout } from "@/service/api/apiWorkout";
import { useParseExerciseName } from "@/hooks/useParseExerciseName";
import ProgressModal from "@/components/Modal/ProgressModal";
import { useRestoreCurrentCourse } from "@/hooks/useRestoreCurrentCourse";
import { useRestoreCurrentWorkout } from "@/hooks/useRestoreCurrentWorkout";
import { setCurrentWorkout } from "@/store/features/courseSlice";

const WorkoutPage = () => {
  useRestoreCurrentCourse();
  useRestoreCurrentWorkout();

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { access } = useAppSelector((state) => state.auth);
  const { currentCourse, currentWorkout } = useAppSelector(
    (state) => state.courses,
  );
  const { parseExerciseName } = useParseExerciseName();

  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  useEffect(() => {
    if (!access || !id) return;

    const workoutId = Array.isArray(id) ? id[0] : id;
    getDataWorkout(access, workoutId)
      .then((res) => {
        dispatch(setCurrentWorkout(res.data));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [access, id, dispatch]);

  const handleFillProgress = () => {
    if (!access) {
      alert("Авторизуйтесь");
      return;
    }
    setIsProgressModalOpen(true);
  };

  const handleSaveProgress = (progressData: Record<string, number>) => {
    setProgress(progressData);
    setIsProgressModalOpen(false);
    alert("Прогресс сохранен");
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
                {currentWorkout.exercises?.map((exercise) => (
                  <div key={exercise._id} className={styles.exerciseItem}>
                    <div className={styles.exerciseName}>
                      {parseExerciseName(exercise.name)}{" "}
                      {progress[exercise._id] || 0}%
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${progress[exercise._id] || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className={styles.fillButton} onClick={handleFillProgress}>
              Заполнить свой прогресс
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
