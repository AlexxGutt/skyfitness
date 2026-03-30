import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setCurrentProgressWorkout } from "@/store/features/courseSlice";

export const useRestoreCurrentProgressWorkout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currentProgressWorkout");
      if (saved) {
        const progress: Record<string, number> = JSON.parse(saved);
        dispatch(setCurrentProgressWorkout(progress));
      }
    } catch (error) {
      console.error("Failed to restore currentProgressWorkout:", error);
    }
  }, [dispatch]);
};
