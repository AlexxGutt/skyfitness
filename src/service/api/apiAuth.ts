import axios from "axios";
import { BASE_URL, SIGNIN_URL, SIGNUP_URL } from "./constants";
import { AuthType } from "@/sharedTypes/sharedTypes";

export const getSignUp = (data: AuthType) => {
  return axios.post(BASE_URL + SIGNUP_URL, data, {
    headers: {
      "Content-Type": "",
    },
  });
};

export const getSignIn = (data: AuthType) => {
  return axios.post(BASE_URL + SIGNIN_URL, data, {
    headers: {
      "Content-Type": "",
    },
  });
};
