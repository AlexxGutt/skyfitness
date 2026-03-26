"use client";

import { useInitAuth } from "@/hooks/useInitAuth";
import { getAllCours } from "@/service/api/apiCard";
import {
  setAllCourses,
  setError,
  setLoading,
} from "@/store/features/courseSlice";
import { useAppSelector } from "@/store/store";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function FetchingCourses() {
  const dispatch = useDispatch();
  const { allCourses, isLoading } = useAppSelector((state) => state.courses);

  useInitAuth();

  useEffect(() => {
    if (allCourses.length === 0 && !isLoading) {
      dispatch(setLoading(true));
      getAllCours()
        .then((res) => {
          dispatch(setAllCourses(res));
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response) {
              dispatch(setError(error.response.data));
            } else if (error.request) {
              dispatch(setError("Произошла ошибка. Попробуйте позже"));
            } else {
              dispatch(setError("Неизвестная ошибка"));
            }
          }
        });
    }
  }, [dispatch, allCourses.length, isLoading]);

  return null;
}
