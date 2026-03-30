"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useAppSelector } from "@/store/store";
import AuthModal from "@/components/Modal/AuthModal";
import ProfileDropdown from "@/components/Modal/UserModal";
import styles from "./header.module.css";

const Header = () => {
  const { isOpen, mode, openModal, closeModal, switchMode } = useAuthModal();
  const { access, username, email } = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!access;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.svg"
                  alt="Логотип Fitness Training"
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <div className={styles.textWrapper}>
                <span className={styles.subtitle}>
                  Онлайн-тренировки для занятий дома
                </span>
              </div>
            </Link>
          </div>

          <div className={styles.authSection}>
            {isAuthenticated ? (
              <div
                ref={buttonRef}
                className={styles.userInfo}
                onClick={toggleDropdown}
              >
                <div className={styles.avatar}>
                  {email ? (
                    <div className={styles.avatarInitial}>
                      {email.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <Image
                      src="/Profile.svg"
                      alt="Профиль"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <span className={styles.userName}>
                  {username || "Пользователь"}
                </span>
                <div className={styles.arrowIcon}>
                  <Image
                    src="/Rectangle 3765.svg"
                    alt=""
                    width={8}
                    height={8}
                    className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ""}`}
                  />
                </div>
                <div ref={dropdownRef}>
                  <ProfileDropdown
                    isOpen={isDropdownOpen}
                    onClose={closeDropdown}
                  />
                </div>
              </div>
            ) : (
              <button
                className={styles.loginButton}
                onClick={() => openModal("sign-in")}
                aria-label="Войти в аккаунт"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isOpen}
        mode={mode}
        onClose={closeModal}
        onSwitchMode={switchMode}
      />
    </>
  );
};

export default Header;
