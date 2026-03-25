"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import styles from "./userModal.module.css";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { username, email } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearUser());
    onClose();
  };

  // Предотвращаем закрытие при клике внутри дропдауна
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dropdown} onClick={handleDropdownClick}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{username || "Пользователь"}</div>
        <div className={styles.userEmail}>{email || "email@example.com"}</div>
      </div>

      <div className={styles.buttonsContainer}>
        <Link
          href="/profile"
          className={styles.profileButton}
          onClick={onClose}
        >
          Мой профиль
        </Link>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
