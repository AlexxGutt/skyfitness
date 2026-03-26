import axios from "axios";
import { BASE_URL } from "./constants";

export const getAddCourse = (token: string, id: string) => {
  console.log(`ID: ${id}`);
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
