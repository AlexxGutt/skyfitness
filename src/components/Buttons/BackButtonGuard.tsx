"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";

export const BackButtonGuard = () => {
  const router = useRouter();
  const { access } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handlePopState = () => {
      if (!access) {
        router.replace("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [access, router]);

  return null;
};
