"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./authModal.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearError,
  setAccess,
  setUserEmail,
  setUsername,
} from "@/store/features/authSlice";
import { getSignIn, getSignUp } from "@/service/api/apiAuth";
import NotificationModal from "@/components/Modal/NotificationModal";
import axios from "axios";

export type AuthModalProps = {
  isOpen: boolean;
  mode: "sign-in" | "sign-up";
  onClose: () => void;
  onSwitchMode: () => void;
};

const AuthModal = ({ isOpen, mode, onClose, onSwitchMode }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const isSignUp = mode === "sign-up";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSwitchMode = () => {
    setError("");
    setErrorField(null);
    dispatch(clearError());
    onSwitchMode();
  };

  const validateForm = () => {
    if (!email.trim()) {
      setErrorField("email");
      return "Введите email";
    }
    if (!password) {
      setErrorField("password");
      return "Введите пароль";
    }
    if (isSignUp && password !== confirmPassword) {
      setErrorField("confirmPassword");
      return "Пароли не совпадают";
    }
    if (isSignUp && password.length < 6) {
      setErrorField("password");
      return "Пароль должен содержать минимум 6 символов";
    }
    setErrorField(null);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorField(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = { email, password };

    if (isSignUp) {
      getSignUp(data)
        .then(() => {
          setNotification({ isOpen: true, message: "Успешная регистрация" });
          setTimeout(() => {
            setNotification({ isOpen: false, message: "" });
            onClose();
          }, 2000);
        })
        .catch((err) => {
          const errMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || "Ошибка регистрации"
            : "Ошибка регистрации";
          setError(errMessage);
        });
    } else {
      getSignIn(data)
        .then((res) => {
          dispatch(setAccess(res.data.token));
          dispatch(setUserEmail(email));
          dispatch(setUsername(email.split("@")[0]));
          onClose();
        })
        .catch((err) => {
          const errMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || "Ошибка входа"
            : "Ошибка входа";
          setError(errMessage);
        });
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
              className={`${styles.input} ${errorField === "email" ? styles.inputError : ""}`}
              disabled={isLoading}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${errorField === "password" ? styles.inputError : ""}`}
              disabled={isLoading}
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${errorField === "confirmPassword" ? styles.inputError : ""}`}
                disabled={isLoading}
                required
              />
            )}
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isLoading}
            >
              {isLoading
                ? "Загрузка..."
                : isSignUp
                  ? "Зарегистрироваться"
                  : "Войти"}
            </button>

            <button
              type="button"
              onClick={handleSwitchMode}
              className={styles.secondaryButton}
              disabled={isLoading}
            >
              {isSignUp ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        type="success"
        message={notification.message}
        onClose={() => setNotification({ isOpen: false, message: "" })}
      />
    </>
  );
};

export default AuthModal;
