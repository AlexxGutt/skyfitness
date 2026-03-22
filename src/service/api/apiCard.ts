import axios from "axios";
import { BASE_URL } from "./constants";

export const getAllCours = () => {
  return axios.get(BASE_URL + "/api/fitness/courses").then((res) => {
    return res.data;
  });
};
