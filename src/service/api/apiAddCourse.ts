import axios from "axios";
import { BASE_URL } from "./constants";

export const getAddCourse = (token: string, id: string) => {
  return axios.post(BASE_URL + "/api/fitness/users/me/courses", id, {
    headers: {
      "Application-type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};
