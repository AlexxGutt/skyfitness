import { Workout } from "@/components/Modal/WorkoutModal";
import { useMemo } from "react";

export const useProgressStatus = (
  currentWorkout: Workout | null,
  currentProgressWorkout: Record<string, number> | null,
) => {
  const status = useMemo(() => {
    if (!currentWorkout?.exercises) return "fill";

    const percentages = currentWorkout.exercises.map((exercise) => {
      const completed = currentProgressWorkout?.[exercise._id] || 0;
      return Math.min(Math.round((completed / exercise.quantity) * 100), 100);
    });

    const allComplete = percentages.every((p) => p === 100);
    const hasProgress = percentages.some((p) => p > 0);

    if (allComplete) return "restart";
    if (hasProgress) return "update";
    return "fill";
  }, [currentWorkout, currentProgressWorkout]);

  const buttonText = useMemo(() => {
    if (status === "restart") return "Начать тренировку заново";
    if (status === "update") return "Обновить свой прогресс";
    return "Заполнить свой прогресс";
  }, [status]);

  return { status, buttonText };
};
