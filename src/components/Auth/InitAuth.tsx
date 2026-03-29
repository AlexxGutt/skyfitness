"use client";

import {
  setAccess,
  setUserEmail,
  setUsername,
} from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { setHydrated } from "@/store/features/authSlice";

const InitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    dispatch(setUsername(username || ""));
    dispatch(setUserEmail(email || ""));
    dispatch(setAccess(access || ""));
    dispatch(setHydrated());
  }, [dispatch]);

  return <></>;
};

export default InitAuth;
