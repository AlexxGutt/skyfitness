"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CourseType } from "@/sharedTypes/sharedTypes";
import {
  getCourseImage,
  getDifficultyText,
  getImageStyle,
} from "@/constants/cardConstants";
import styles from "./card.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAddCourse, getDeleteCourse } from "@/service/api/apiCourse";
import { useRouter } from "next/navigation";
import axios from "axios";
import NotificationModal, {
  NotificationType,
} from "@/components/Modal/NotificationModal";
import { setLoading } from "@/store/features/loaderSlice";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import { useResetCourseProgress } from "@/hooks/useResetCourseProgress";

export type CardProps = {
  course: CourseType;
  variant?: "add" | "delete";
  onSuccess?: () => void;
  progress?: number;
  onStartCourse?: (courseId: string) => void;
};

const Card = ({
  course,
  variant = "add",
  onSuccess,
  progress = 0,
  onStartCourse,
}: CardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { access } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { resetProgress } = useResetCourseProgress({
    onSuccess: (message) => showNotification("success", message),
    onError: (message) => showNotification("error", message),
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    nameRU,
    nameEN,
    durationInDays,
    difficulty,
    dailyDurationInMinutes,
    _id,
  } = course;

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const isDeleteVariant = variant === "delete";
  const buttonIcon = isDeleteVariant
    ? "/Remove-in-Circle.svg"
    : "/Add-in-Circle.svg";
  const buttonAlt = isDeleteVariant ? "Удалить курс" : "Добавить курс";
  const tooltipText = isDeleteVariant ? "Удалить курс" : "Добавить курс";

  const getButtonText = () => {
    if (progress === 100) return "Начать заново";
    if (progress > 0) return "Продолжить";
    return "Начать";
  };

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ isOpen: true, type, message });
    if (type !== "confirm") {
      setTimeout(
        () => setNotification({ isOpen: false, type: "success", message: "" }),
        3000,
      );
    }
  };

  const handleCardClick = () => {
    dispatch(setLoading(true));
    router.push(`/course/${_id}`);
  };

  const performDelete = async () => {
    if (!access) {
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      if (isDeleteVariant) {
        await resetProgress(_id);
      }

      const request = isDeleteVariant
        ? getDeleteCourse(access, _id)
        : getAddCourse(access, _id);

      await request;

      const message = isDeleteVariant
        ? "Курс успешно удален"
        : "Курс успешно добавлен";
      showNotification("success", message);
      setTimeout(() => {
        onSuccess?.();
      }, 3100);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Произошла ошибка"
        : "Произошла ошибка";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!access) {
      showNotification("error", "Авторизуйтесь, чтобы продолжить");
      return;
    }

    if (isDeleteVariant && progress > 0 && progress < 100) {
      setNotification({
        isOpen: true,
        type: "confirm",
        message:
          "Вы уверены что хотите удалить курс, весь прогресс будет утерян?",
      });
      return;
    }

    performDelete();
  };

  const handleActionClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (progress === 100 && access) {
      await resetProgress(_id);
      onSuccess?.();
    } else if (onStartCourse) {
      onStartCourse(_id);
    }
  };

  return (
    <>
      {isLoading && <GlobalLoader />}
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={getCourseImage(nameEN)}
              alt={nameRU}
              width={834}
              height={557}
              className={styles.image}
              style={getImageStyle(nameEN, isMobile)}
              loading="eager"
            />
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.addButton}
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              <Image src={buttonIcon} alt={buttonAlt} width={32} height={32} />
            </button>
            <span className={styles.tooltip}>{tooltipText}</span>
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{nameRU}</h3>
          <div className={styles.badgesRow}>
            <div className={styles.badge}>
              <Image
                src="/Calendar.svg"
                alt="Календарь"
                width={18}
                height={18}
              />
              <span className={styles.badgeText}>{durationInDays} дней</span>
            </div>
            <div className={styles.badge}>
              <Image src="/Time.svg" alt="Время" width={18} height={18} />
              <span className={styles.badgeText}>
                {dailyDurationInMinutes.from}-{dailyDurationInMinutes.to}
                мин/день
              </span>
            </div>
          </div>
          <div className={styles.badgesRow}>
            <div className={styles.badge}>
              <Image
                src="/mingcute_signal-fill.svg"
                alt="Сложность"
                width={18}
                height={18}
              />
              <span className={styles.badgeText}>
                {getDifficultyText(difficulty)}
              </span>
            </div>
          </div>

          {variant === "delete" && (
            <div className={styles.progressSection}>
              <div className={styles.progressText}>Прогресс {progress}%</div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                className={styles.actionButton}
                onClick={handleActionClick}
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : getButtonText()}{" "}
              </button>
            </div>
          )}
        </div>
      </div>
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        onClose={() =>
          setNotification({ isOpen: false, type: "success", message: "" })
        }
        onConfirm={performDelete}
      />
    </>
  );
};

export default Card;
