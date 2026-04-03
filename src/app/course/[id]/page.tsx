"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { getHeroImageStyle } from "@/constants/coursePageConstants";
import { getCourseImage } from "@/constants/cardConstants";
import { getAddCourse } from "@/service/api/apiCourse";
import WorkoutModal from "@/components/Modal/WorkoutModal";
import NotificationModal from "@/components/Modal/NotificationModal";
import axios from "axios";
import { setLoading } from "@/store/features/loaderSlice";
import { useUserData } from "@/hooks/useUserCourse";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useCourseWorkouts } from "@/hooks/useCourseWorkouts";
import AuthModal from "@/components/Modal/AuthModal";

const CoursePage = () => {
  const dispatch = useAppDispatch();
  const { fetchUserData } = useUserData();
  const { getCourseButtonInfo } = useCourseProgress();
  const { id } = useParams();
  const { allCourses } = useAppSelector((state) => state.courses);
  const { access } = useAppSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, mode, openModal, closeModal, switchMode } = useAuthModal();

  // Используем универсальный хук для работы с тренировками
  const {
    isModalOpen,
    selectedWorkouts,
    currentCourseId,
    openWorkoutsModal,
    closeWorkoutsModal,
    startWorkout,
  } = useCourseWorkouts({
    onError: (message) => showNotification(message),
  });

  const course = useMemo(() => {
    if (id && allCourses.length > 0) {
      return allCourses.find((c) => c._id === id) || null;
    }
    return null;
  }, [id, allCourses]);

  const courseButtonInfo = useMemo(() => {
    if (!course) return null;
    return getCourseButtonInfo(course._id);
  }, [course, getCourseButtonInfo]);

  const isCourseAdded = courseButtonInfo?.isAdded ?? false;
  const progress = courseButtonInfo?.progress ?? 0;

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const loading = allCourses.length === 0;

  const benefits = course?.fitting || [""];
  const directions = course?.directions || [""];

  const benefitsList = [
    "проработка всех групп мышц",
    "тренировка суставов",
    "улучшение циркуляции крови",
    "упражнения заряжают бодростью",
    "помогают противостоять стрессам",
  ];

  const showNotification = (message: string) => {
    setNotification({ isOpen: true, message });
    setTimeout(() => setNotification({ isOpen: false, message: "" }), 3000);
  };

  // Основная логика кнопки
  const handleMainButtonClick = async () => {
    const ID = course?._id as string;

    // Если не авторизован — открываем модалку авторизации
    if (!access) {
      return openModal("sign-in");
    }

    // Если курс не добавлен — добавляем
    if (!isCourseAdded) {
      setIsLoading(true);
      dispatch(setLoading(true));

      try {
        await getAddCourse(access, ID);
        showNotification("Курс успешно добавлен!");
        await fetchUserData(); // Обновляем данные, кнопка изменится
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || "Ошибка добавления курса"
          : "Ошибка добавления курса";
        showNotification(errorMessage);
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
      return;
    }

    // Если курс добавлен — открываем модальное окно с тренировками
    await openWorkoutsModal(ID);
  };

  const getButtonText = () => {
    if (!access) return "Войдите, чтобы добавить курс";
    if (!isCourseAdded) return "Добавить курс";
    if (progress === 100) return "Начать заново";
    if (progress > 0) return `Продолжить (${progress}%)`;
    return "Начать";
  };

  const heroImageStyle = getHeroImageStyle(course?.nameEN || "Yoga", isMobile);

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.notFound}>Курс не найден</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <div
            className={styles.heroBlock}
            style={{ backgroundColor: heroImageStyle.bgColor }}
          >
            <div className={styles.heroContent}>
              <h1 className={styles.courseTitle}>{course.nameRU}</h1>
              <div
                className={styles.heroImage}
                style={{
                  top: `${heroImageStyle.top}px`,
                  right: `${heroImageStyle.right}px`,
                  width: `${heroImageStyle.width}px`,
                  height: `${heroImageStyle.height}px`,
                }}
              >
                <Image
                  src={getCourseImage(course.nameEN)}
                  alt={course.nameRU}
                  width={heroImageStyle.width}
                  height={heroImageStyle.height}
                  className={styles.courseImage}
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitNumber}>{index + 1}</div>
                <div className={styles.benefitText}>{benefit}</div>
              </div>
            ))}
          </div>

          <h2 className={styles.directionsTitle}>Направления</h2>

          <div className={styles.directionsBlock}>
            <Image
              src="/Vector green.svg"
              alt=""
              width={670}
              height={491}
              className={styles.ctaImageGreenMobile}
            />
            <Image
              src="/sportsman.svg"
              alt=""
              width={519}
              height={540}
              className={styles.ctaImageSportsman}
            />
            <div className={styles.directionsGrid}>
              {directions.map((direction, index) => (
                <div key={index} className={styles.directionItem}>
                  <Image
                    src="/Sparcle.svg"
                    alt=""
                    width={26}
                    height={26}
                    className={styles.directionIcon}
                  />
                  <span className={styles.directionText}>{direction}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.callToAction}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Начните путь <br />к новому телу
              </h2>
              <ul className={styles.ctaList}>
                {benefitsList.map((item, index) => (
                  <li key={index} className={styles.ctaListItem}>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className={styles.ctaButton}
                onClick={handleMainButtonClick}
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : getButtonText()}
              </button>
            </div>

            <div className={styles.ctaImages}>
              <Image
                src="/Vector green.svg"
                alt=""
                width={670}
                height={491}
                className={styles.ctaImageGreen}
              />
              <Image
                src="/Vector black.svg"
                alt=""
                width={50}
                height={43}
                className={styles.ctaImageBlack}
              />
            </div>
          </div>
        </div>
      </main>

      <WorkoutModal
        isOpen={isModalOpen}
        onClose={closeWorkoutsModal}
        workouts={selectedWorkouts}
        onStartWorkout={startWorkout}
        courseId={currentCourseId || ""}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        type="success"
        message={notification.message}
        onClose={() => setNotification({ isOpen: false, message: "" })}
      />

      <AuthModal
        isOpen={isOpen}
        mode={mode}
        onClose={closeModal}
        onSwitchMode={switchMode}
      />
    </>
  );
};

export default CoursePage;
