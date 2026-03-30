"use client";

import React, { useEffect, useState } from "react";
import styles from "./progressModal.module.css";
import { useCustomScroll } from "@/hooks/useCustomScroll";
import { useParseExerciseName } from "@/hooks/useParseExerciseName";

export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};

type ProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onSave?: (progress: Record<string, number>) => void;
};

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  exercises,
  onSave,
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { parseExerciseName } = useParseExerciseName();

  const { listRef, thumbRef, thumbTop, thumbHeight, visible } = useCustomScroll(
    exercises,
    isOpen,
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleInputChange = (exerciseId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [exerciseId]: value }));
  };

  const handleSave = () => {
    const progress: Record<string, number> = {};
    exercises.forEach((exercise) => {
      const value = parseInt(inputValues[exercise._id] || "0", 10);
      progress[exercise._id] = Math.min(value, exercise.quantity);
    });
    onSave?.(progress);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Мой прогресс</h2>

          <div className={styles.scrollContainer}>
            <div ref={listRef} className={styles.exercisesList}>
              {exercises.map((exercise) => (
                <div key={exercise._id} className={styles.exerciseBlock}>
                  <div className={styles.question}>
                    Сколько раз вы сделали{" "}
                    {parseExerciseName(exercise.name).toLowerCase()}?
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={exercise.quantity}
                    value={inputValues[exercise._id] || ""}
                    onChange={(e) =>
                      handleInputChange(exercise._id, e.target.value)
                    }
                    className={styles.input}
                    placeholder="0"
                  />
                </div>
              ))}
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

          <button className={styles.saveButton} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
};

export default ProgressModal;
