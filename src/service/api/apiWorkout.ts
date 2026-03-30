import axios from "axios";
import { BASE_URL } from "./constants";

export const getCourseWorkout = (token: string, id: string) => {
  return axios.get(BASE_URL + `/api/fitness/courses/${id}/workouts`, {
    headers: {
      "Content-Type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const getDataWorkout = (token: string, id: string) => {
  return axios.get(BASE_URL + `/api/fitness/workouts/${id}`, {
    headers: {
      "Content-Type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const getProgressWorkout = (
  token: string,
  courseId: string,
  workoutID: string,
) => {
  return axios.get(
    BASE_URL +
      `/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutID}`,
    {
      headers: {
        "Content-Type": "",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
};

export const changeProgressWorkout = (
  token: string,
  courseId: string,
  workoutID: string,
  data: { progressData: number[] },
) => {
  return axios.patch(
    BASE_URL + `/api/fitness/courses/${courseId}/workouts/${workoutID}`,
    data,
    {
      headers: {
        "Content-Type": "",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
};
