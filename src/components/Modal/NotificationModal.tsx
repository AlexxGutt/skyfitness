"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./notificationModal.module.css";

export type NotificationType = "success" | "error" | "confirm";

export type NotificationModalProps = {
  isOpen: boolean;
  type: NotificationType;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
};

const NotificationModal = ({
  isOpen,
  type,
  message,
  onClose,
  onConfirm,
}: NotificationModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const isSuccess = type === "success";
  const isConfirm = type === "confirm";

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setTimeout(() => {
        onConfirm?.();
      }, 100);
    }, 300);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
        onClick={!isConfirm ? handleClose : undefined}
      />
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className={`${styles.message} ${isSuccess ? styles.success : isConfirm ? styles.confirm : styles.error}`}
        >
          {message}
        </p>
        {isSuccess && (
          <Image
            src="/Check-in-Circle.svg"
            alt="Успешно"
            width={68}
            height={68}
          />
        )}
        {isConfirm && (
          <div className={styles.buttonGroup}>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              Удалить
            </button>
            <button className={styles.cancelButton} onClick={handleClose}>
              Отмена
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationModal;
