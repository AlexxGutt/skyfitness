"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./authModal.module.css";

export type AuthModalProps = {
  isOpen: boolean;
  mode: "sign-in" | "sign-up";
  onClose: () => void;
  onSwitchMode: () => void;
};

const AuthModal = ({ isOpen, mode, onClose, onSwitchMode }: AuthModalProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const isSignUp = mode === "sign-up";

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      console.log("Регистрация:", { email, password, confirmPassword });
    } else {
      console.log("Вход:", { email, password });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.formWrapper}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>

          <div className={styles.logoWrapper}>
            <Image
              src="/logo.svg"
              alt="Fitness Training"
              width={220}
              height={35}
            />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Эл. почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
            )}

            <button type="submit" className={styles.primaryButton}>
              {isSignUp ? "Зарегистрироваться" : "Войти"}
            </button>

            <button
              type="button"
              onClick={onSwitchMode}
              className={styles.secondaryButton}
            >
              {isSignUp ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
