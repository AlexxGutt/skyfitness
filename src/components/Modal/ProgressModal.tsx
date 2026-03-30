"use client";

import React, { useEffect, useState } from "react";
import styles from "./progressModal.module.css";
import { useCustomScroll } from "@/hooks/useCustomScroll";
import { useParseExerciseName } from "@/hooks/useParseExerciseName";
import { useAppDispatch } from "@/store/store";
import { setLoading } from "@/store/features/loaderSlice";
import GlobalLoader from "@/components/Loader/GlobalLoader";

export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};

type ProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  isVideoOnly?: boolean;
  onSave?: (progress: Record<string, number>) => void;
};

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  exercises,
  isVideoOnly = false,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [videoWatched, setVideoWatched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    if (!isSaving) {
      setInputValues((prev) => ({ ...prev, [exerciseId]: value }));
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    dispatch(setLoading(true));

    try {
      if (isVideoOnly) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        onSave?.({ video: videoWatched ? 100 : 0 });
        setVideoWatched(false);
      } else {
        const progress: Record<string, number> = {};
        exercises.forEach((exercise) => {
          const value = parseInt(inputValues[exercise._id] || "0", 10);
          progress[exercise._id] = Math.min(value, exercise.quantity);
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
        onSave?.(progress);
        setInputValues({});
      }
      onClose();
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
      dispatch(setLoading(false));
    }
  };

  if (isVideoOnly) {
    return (
      <>
        {isSaving && <GlobalLoader />}

        <div
          className={styles.overlay}
          onClick={!isSaving ? onClose : undefined}
        />
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>Мой прогресс</h2>
            <div className={styles.videoQuestion}>Вы посмотрели видеоурок?</div>
            <div className={styles.videoButtons}>
              <button
                className={`${styles.videoOption} ${videoWatched ? styles.videoOptionActive : ""}`}
                onClick={() => !isSaving && setVideoWatched(true)}
                disabled={isSaving}
              >
                Да
              </button>
              <button
                className={`${styles.videoOption} ${!videoWatched ? styles.videoOptionActive : ""}`}
                onClick={() => !isSaving && setVideoWatched(false)}
                disabled={isSaving}
              >
                Нет
              </button>
            </div>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isSaving && <GlobalLoader />}

      <div
        className={styles.overlay}
        onClick={!isSaving ? onClose : undefined}
      />
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
                    disabled={isSaving}
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

          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProgressModal;
