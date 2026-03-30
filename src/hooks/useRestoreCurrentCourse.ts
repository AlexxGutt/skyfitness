import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setCurrentCourse } from "@/store/features/courseSlice";
import { CourseType } from "@/sharedTypes/sharedTypes";

export const useRestoreCurrentCourse = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currentCourse");
      if (saved) {
        const course: CourseType = JSON.parse(saved);
        dispatch(setCurrentCourse(course));
      }
    } catch (error) {
      console.error("Failed to restore currentCourse:", error);
    }
  }, [dispatch]);
};
