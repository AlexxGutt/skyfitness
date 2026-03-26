import axios from "axios";
import { BASE_URL } from "./constants";

export const getUsersCourse = (token: string) => {
  return axios.get(BASE_URL + "/api/fitness/users/me", {
    headers: {
      "Content-Type": "",
      "Authorization": `Bearer ${token}`,
    },
  });
};
