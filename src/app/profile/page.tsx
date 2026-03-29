"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import CardItems from "@/components/CardItems/CardItems";
import WorkoutModal from "@/components/Modal/WorkoutModal";
import { Workout } from "@/components/Modal/WorkoutModal";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import { getUsersCourse } from "@/service/api/apiCourse";
import { setUsersCourse } from "@/store/features/courseSlice";
import { getCourseWorkout } from "@/service/api/apiWorkout";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { username, email, access } = useAppSelector((state) => state.auth);
  const [refreshKey, setRefreshKey] = useState(0);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(
    {},
  );

  // Состояния для модального окна
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]); // ← убрали any, добавили тип Workout[]

  const fetchUserData = useCallback(() => {
    if (access) {
      getUsersCourse(access)
        .then((res) => {
          dispatch(setUsersCourse(res.data.user));

          const progress: Record<string, number> = {};
          res.data.user.selectedCourses?.forEach((courseId: string) => {
            progress[courseId] = 40;
          });
          setCourseProgress(progress);
        })
        .catch((err) => {
          console.log("Ошибка:", err);
        });
    }
  }, [access, dispatch]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace("/");
  };

  const handleCourseChange = () => {
    fetchUserData();
    setRefreshKey((prev) => prev + 1);
  };

  const handleStartCourse = async (courseId: string) => {
    if (!access) return;
    getCourseWorkout(access, courseId)
      .then((res) => {
        console.log(res);
        const response = res.data;
        setSelectedWorkouts(response);
        setIsWorkoutModalOpen(true);
      })
      .catch((err) => {
        const error = err.response.data.message;
        alert(error);
      });
  };
  const handleStartWorkout = (workoutId: string) => {
    console.log("Начинаем тренировку:", workoutId);
    // TODO: Переход на страницу тренировки
    setIsWorkoutModalOpen(false);
  };

  const selectedCourseIds = useAppSelector(
    (state) => state.courses.usersCourse?.selectedCourses || [],
  );

  useEffect(() => {
    if (!access) {
      router.replace("/");
    }
  }, [access, router]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Профиль</h1>

          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <Image
                src="/Mask group.svg"
                alt="Аватар"
                width={197}
                height={197}
                className={styles.avatar}
              />
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
              courseProgress={courseProgress}
              onStartCourse={handleStartCourse}
            />
          </div>
        </div>
      </main>

      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        workouts={selectedWorkouts}
        onStartWorkout={handleStartWorkout}
      />
    </>
  );
};

export default ProfilePage;
