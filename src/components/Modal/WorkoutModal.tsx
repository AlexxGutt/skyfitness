"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./workoutModal.module.css";
import { parseWorkoutName } from "@/hooks/parseWorkoutName";
import { useCustomScroll } from "@/hooks/useCustomScroll";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setLoading } from "@/store/features/loaderSlice";
import GlobalLoader from "@/components/Loader/GlobalLoader";

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
  courseId: string;
};

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  workouts = [],
  onStartWorkout,
  courseId,
}) => {
  const dispatch = useAppDispatch();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [isStarting, setIsStarting] = useState(false);
  const { usersCourse } = useAppSelector((state) => state.courses);
  const { listRef, thumbRef, thumbTop, thumbHeight, visible } = useCustomScroll(
    workouts,
    isOpen,
  );

  const courseProgress = usersCourse?.courseProgress?.find(
    (course) => course.courseId === courseId,
  )?.workoutsProgress;

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
    if (!isStarting) {
      setSelectedWorkoutId(workoutId);
    }
  };

  const handleStartClick = async () => {
    if (selectedWorkoutId && onStartWorkout && !isStarting) {
      setIsStarting(true);
      dispatch(setLoading(true));

      try {
        await onStartWorkout(selectedWorkoutId);
        onClose();
      } catch (error) {
        console.error("Error starting workout:", error);
      } finally {
        setIsStarting(false);
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <>
      {isStarting && <GlobalLoader />}
      <div
        className={styles.overlay}
        onClick={!isStarting ? onClose : undefined}
      />
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Выберите тренировку</h2>

          <div className={styles.scrollContainer}>
            <div ref={listRef} className={styles.workoutsList}>
              {workouts.map((workout) => {
                const { name, description } = parseWorkoutName(workout.name);
                const isSelected = selectedWorkoutId === workout._id;
                const isCompleted =
                  courseProgress?.find((w) => w.workoutId === workout._id)
                    ?.workoutCompleted ?? false;
                const icon = isCompleted
                  ? "/Check-in-Circle.svg"
                  : "/Check-in-Circle-Empty.svg";

                return (
                  <React.Fragment key={workout._id}>
                    <div
                      className={`${styles.workoutItem} ${isSelected ? styles.selected : ""} ${isStarting ? styles.disabled : ""}`}
                      onClick={() => handleWorkoutClick(workout._id)}
                    >
                      <div className={styles.checkbox}>
                        <Image
                          src={icon}
                          alt={isCompleted ? "Пройдено" : "Не пройдено"}
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
            onClick={handleStartClick}
            disabled={!selectedWorkoutId || isStarting}
          >
            {isStarting ? "Загрузка..." : "Начать"}
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkoutModal;
