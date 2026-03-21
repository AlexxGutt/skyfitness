"use client";

import { getAllCours } from "@/service/api/apiCard";
import { setAllCourses, setFetchError } from "@/store/features/courseSlice";
import { useAppSelector } from "@/store/store";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function FetchingCourses() {
  const dispatch = useDispatch();
  const { allCourses } = useAppSelector((state) => state.courses);
  useEffect(() => {
    if (allCourses.length) {
      dispatch(setAllCourses(allCourses));
    } else {
      getAllCours()
        .then((res) => {
          dispatch(setAllCourses(res));
        })
        .catch((error) => {
          if (error instanceof AxiosError)
            if (error.response) {
              dispatch(setFetchError(error.response.data));
            } else if (error.request) {
              dispatch(setFetchError("Произошла ошибка. Попробуйте позже"));
            } else {
              dispatch(setFetchError("Неизвестная ошибка"));
            }
        });
    }
  }, [dispatch, allCourses]);

  return <></>;
}
