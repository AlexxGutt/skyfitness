"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./workoutModal.module.css";
import { parseWorkoutName } from "@/hooks/parseWorkoutName";
import { useCustomScroll } from "@/hooks/useCustomScroll";

export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises?: Array<{
    name: string;
    quantity: number;
    _id: string;
  }>;
  __v?: number;
};

type WorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  onStartWorkout?: (workoutId: string) => void;
};

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  workouts = [],
  onStartWorkout,
}) => {
  const { listRef, thumbRef, thumbTop, thumbHeight, visible } =
    useCustomScroll(workouts);

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

          <div className={styles.scrollContainer}>
            <div ref={listRef} className={styles.workoutsList}>
              {workouts.map((workout) => {
                const { name, description } = parseWorkoutName(workout.name);
                return (
                  <React.Fragment key={workout._id}>
                    <div
                      className={styles.workoutItem}
                      onClick={() => handleWorkoutClick(workout._id)}
                    >
                      <div className={styles.checkbox}>
                        <Image
                          src="/Check-in-Circle-Empty.svg"
                          alt="Не пройдено"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className={styles.workoutInfo}>
                        <div className={styles.workoutName}>{name}</div>
                        <div className={styles.workoutDescription}>
                          {description}
                        </div>
                      </div>
                    </div>
                    <div className={styles.divider} />
                  </React.Fragment>
                );
              })}
            </div>
            {visible && (
              <div className={styles.scrollTrack}>
                <div
                  ref={thumbRef}
                  className={styles.scrollThumb}
                  style={{ height: thumbHeight, top: thumbTop }}
                />
              </div>
            )}
          </div>

          <button
            className={styles.startButton}
            onClick={() => {
              if (workouts.length > 0) {
                handleWorkoutClick(workouts[0]._id);
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
