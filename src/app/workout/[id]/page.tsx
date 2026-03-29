"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/store";
import Header from "@/components/Header/Header";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Workout } from "@/components/Modal/WorkoutModal";
import { getDataWorkout } from "@/service/api/apiWorkout";
import { useParseExerciseName } from "@/hooks/useParseExerciseName";

const WorkoutPage = () => {
  const { id } = useParams();
  const { access } = useAppSelector((state) => state.auth);
  const { currentCourse } = useAppSelector((state) => state.courses);
  const { parseExerciseName } = useParseExerciseName();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!access || !id) return;

    const workoutId = Array.isArray(id) ? id[0] : id;
    getDataWorkout(access, workoutId)
      .then((res) => {
        setWorkout(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [access, id]);

  const handleFillProgress = () => {
    if (!access) {
      alert("Авторизуйтесь");
      return;
    }
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

  if (!workout) {
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
            {currentCourse?.nameRU || workout.name}
          </h1>

          <iframe
            className={styles.videoFrame}
            src={workout.video}
            title={workout.name}
            allowFullScreen
          />

          <div className={styles.exercisesCard}>
            <div className={styles.exercisesBlock}>
              <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>

              <div className={styles.exercisesList}>
                {workout.exercises?.map((exercise) => (
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
    </>
  );
};

export default WorkoutPage;
