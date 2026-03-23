"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/Modal/AuthModal";
import styles from "./header.module.css";

const Header: React.FC = () => {
  const { isOpen, mode, openModal, closeModal, switchMode } = useAuthModal();

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
            <button
              className={styles.loginButton}
              onClick={() => openModal("sign-in")}
              aria-label="Войти в аккаунт"
            >
              Войти
            </button>
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
