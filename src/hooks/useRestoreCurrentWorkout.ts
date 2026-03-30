import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setCurrentWorkout } from "@/store/features/courseSlice";
import { Workout } from "@/components/Modal/WorkoutModal";

export const useRestoreCurrentWorkout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currentWorkout");
      if (saved) {
        const workout: Workout = JSON.parse(saved);
        dispatch(setCurrentWorkout(workout));
      }
    } catch (error) {
      console.error("Failed to restore currentWorkout:", error);
    }
  }, [dispatch]);
};
