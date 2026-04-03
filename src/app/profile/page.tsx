"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import CardItems from "@/components/CardItems/CardItems";
import WorkoutModal from "@/components/Modal/WorkoutModal";
import styles from "./page.module.css";
import { useEffect, useState, useMemo } from "react";
import NotificationModal from "@/components/Modal/NotificationModal";
import { setLoading } from "@/store/features/loaderSlice";
import ButtonUpToTop from "@/components/Buttons/ButtonUpToTop";
import { useUserData } from "@/hooks/useUserCourse";
import { useCourseWorkouts } from "@/hooks/useCourseWorkouts";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { username, email, access, isHydrated } = useAppSelector(
    (state) => state.auth,
  );
  const { usersCourse } = useAppSelector((state) => state.courses);
  const [refreshKey, setRefreshKey] = useState(0);
  const { fetchUserData } = useUserData();
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

  const selectedCourseIds = useMemo(() => {
    return usersCourse?.selectedCourses || [];
  }, [usersCourse?.selectedCourses]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  const showNotification = (message: string) => {
    setNotification({ isOpen: true, message });
    setTimeout(() => setNotification({ isOpen: false, message: "" }), 3000);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace("/");
  };

  const handleCourseChange = async () => {
    await fetchUserData();
    setRefreshKey((prev) => prev + 1);
  };

  const handleStartCourse = async (courseId: string) => {
    await openWorkoutsModal(courseId);
  };

  useEffect(() => {
    if (isHydrated && !access) {
      router.replace("/");
    }
  }, [access, router, isHydrated]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Профиль</h1>

          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              {access && email ? (
                <div className={styles.avatarInitial}>
                  {email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Image
                  src="/Mask group.svg"
                  alt="Аватар"
                  width={197}
                  height={197}
                  className={styles.avatar}
                  loading="eager"
                />
              )}
            </div>

            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{username || "Пользователь"}</h2>
              <div className={styles.userEmail}>
                Логин: {email || "email@example.com"}
              </div>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>

          <div className={styles.coursesSection}>
            <h1 className={styles.coursesTitle}>Мои курсы</h1>
            <CardItems
              key={refreshKey}
              type="user"
              courseIds={selectedCourseIds}
              onCourseChange={handleCourseChange}
              onStartCourse={handleStartCourse}
            />
          </div>
          <div className={styles.buttonContainer}>
            <ButtonUpToTop />
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
        type="error"
        message={notification.message}
        onClose={() => setNotification({ isOpen: false, message: "" })}
      />
    </>
  );
};

export default ProfilePage;
