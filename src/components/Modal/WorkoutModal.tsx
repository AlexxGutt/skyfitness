"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./workoutModal.module.css";

export type Workout = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
};

type WorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  courseName: string;
  onStartWorkout?: (workoutId: string) => void;
};

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  workouts,
  onStartWorkout,
}) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleWorkoutClick = (workoutId: string) => {
    if (onStartWorkout) {
      onStartWorkout(workoutId);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>

          <h2 className={styles.title}>Выберите тренировку</h2>

          <div className={styles.workoutsList}>
            {workouts.map((workout, index) => (
              <React.Fragment key={workout.id}>
                <div
                  className={styles.workoutItem}
                  onClick={() => handleWorkoutClick(workout.id)}
                >
                  <div className={styles.checkbox}>
                    <Image
                      src={
                        workout.completed
                          ? "/Check-in-Circle.svg"
                          : "/Check-in-Circle-Empty.svg"
                      }
                      alt={workout.completed ? "Пройдено" : "Не пройдено"}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className={styles.workoutInfo}>
                    <div className={styles.workoutName}>{workout.name}</div>
                    <div className={styles.workoutDescription}>
                      {workout.description}
                    </div>
                  </div>
                </div>
                {index < workouts.length - 1 && (
                  <div className={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            className={styles.startButton}
            onClick={() => {
              // Найти первую непройденную тренировку или первую в списке
              const firstIncomplete = workouts.find((w) => !w.completed);
              if (firstIncomplete) {
                handleWorkoutClick(firstIncomplete.id);
              } else if (workouts.length > 0) {
                handleWorkoutClick(workouts[0].id);
              }
            }}
          >
            Начать
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkoutModal;
