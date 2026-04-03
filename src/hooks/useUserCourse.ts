import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUsersCourse } from "@/store/features/courseSlice";
import { getUsersCourse } from "@/service/api/apiCourse";
import axios from "axios";

export const useUserData = (showNotification?: (message: string) => void) => {
  const dispatch = useAppDispatch();
  const { access } = useAppSelector((state) => state.auth);

  const fetchUserData = useCallback(() => {
    if (access) {
      getUsersCourse(access)
        .then((res) => {
          dispatch(setUsersCourse(res.data.user));
        })
        .catch((err) => {
          const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || "Ошибка"
            : "Ошибка";
          showNotification?.(errorMessage);
        });
    }
  }, [access, dispatch, showNotification]);

  return { fetchUserData };
};
