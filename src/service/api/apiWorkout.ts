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
