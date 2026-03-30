"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/store";

export const BackButtonGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
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
