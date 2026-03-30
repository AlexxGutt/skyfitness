"use client";

import {
  setAccess,
  setUserEmail,
  setUsername,
  setHydrated,
} from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

const InitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (username) dispatch(setUsername(username));
    if (email) dispatch(setUserEmail(email));
    if (access) dispatch(setAccess(access));
    dispatch(setHydrated());
  }, [dispatch]);

  return <></>;
};

export default InitAuth;
