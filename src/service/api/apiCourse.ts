import axios from "axios";
import { BASE_URL } from "./constants";

export const getAllCours = () => {
  return axios.get(BASE_URL + "/api/fitness/courses").then((res) => {
    return res.data;
  });
};

export const getAddCourse = (token: string, id: string) => {
  return axios.post(
    BASE_URL + "/api/fitness/users/me/courses",
    { courseId: id },
    {
      headers: {
        "Content-Type": "",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
};

export const getUsersCourse = (token: string) => {
  return axios.get(BASE_URL + "/api/fitness/users/me", {
    headers: {
      "Content-Type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const getDeleteCourse = (token: string, id: string) => {
  return axios.delete(BASE_URL + `/api/fitness/users/me/courses/${id}`, {
    headers: {
      "Content-Type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const deleteProgressCourse = (token: string, courseId: string) => {
  return axios.patch(
    BASE_URL + `/api/fitness/courses/${courseId}/reset`,
    null,
    {
      headers: {
        "Content-Type": "",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
};
