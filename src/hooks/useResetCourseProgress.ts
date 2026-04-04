"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { deleteProgressCourse } from "@/service/api/apiCourse";
import { clearProgressCourse } from "@/store/features/courseSlice";
import axios from "axios";
import { setLoading } from "@/store/features/loaderSlice";

interface UseResetCourseProgressProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useResetCourseProgress = ({
  onSuccess,
  onError,
}: UseResetCourseProgressProps = {}) => {
  const dispatch = useAppDispatch();
  const { access } = useAppSelector((state) => state.auth);

  const resetProgress = useCallback(
    async (courseId: string) => {
      if (!access) {
        onError?.("Авторизуйтесь, чтобы продолжить");
        return false;
      }

      dispatch(setLoading(true));

      try {
        await deleteProgressCourse(access, courseId);
        dispatch(clearProgressCourse());
        onSuccess?.("Прогресс курса очищен");
        return true;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || "Ошибка при очистке прогресса"
          : "Ошибка при очистке прогресса";
        onError?.(errorMessage);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [access, dispatch, onSuccess, onError],
  );

  return { resetProgress };
};
