"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setLoading } from "@/store/features/loaderSlice";
import { useLogout } from "@/hooks/useLogout";
import styles from "./userModal.module.css";
import GlobalLoader from "../Loader/GlobalLoader";

type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { logout } = useLogout();
  const { username, email } = useAppSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await logout({
      redirectTo: "/",
    });

    setIsLoggingOut(false);
    onClose();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    onClose();
    router.push("/profile");
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoggingOut && <GlobalLoader />}
      <div className={styles.dropdown} onClick={handleDropdownClick}>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{username || "Пользователь"}</div>
          <div className={styles.userEmail}>{email || "email@example.com"}</div>
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.profileButton} onClick={handleProfileClick}>
            Мой профиль
          </button>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Выход..." : "Выйти"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
