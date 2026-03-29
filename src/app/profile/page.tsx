"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import CardItems from "@/components/CardItems/CardItems";
import WorkoutModal from "@/components/Modal/WorkoutModal";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import { getUsersCourse } from "@/service/api/apiCourse";
import { setUsersCourse } from "@/store/features/courseSlice";

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
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
    workouts: {
      id: string;
      name: string;
      description: string;
      completed: boolean;
    }[];
  } | null>(null);

  const fetchUserData = useCallback(() => {
    if (access) {
      getUsersCourse(access)
        .then((res) => {
          dispatch(setUsersCourse(res.data.user));

          // Здесь нужно будет вычислить прогресс из courseProgress
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

  const handleStartCourse = (courseId: string) => {
    // TODO: Получить тренировки курса из API
    // Пока заглушка
    const mockWorkouts = [
      {
        id: "1",
        name: "Утренняя практика",
        description: "Йога на каждый день / 1 день",
        completed: false,
      },
      {
        id: "2",
        name: "Дневная практика",
        description: "Йога на каждый день / 2 день",
        completed: true,
      },
      {
        id: "3",
        name: "Вечерняя практика",
        description: "Йога на каждый день / 3 день",
        completed: false,
      },
    ];

    setSelectedCourse({
      id: courseId,
      name: "Йога",
      workouts: mockWorkouts,
    });
    setIsWorkoutModalOpen(true);
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

      {selectedCourse && (
        <WorkoutModal
          isOpen={isWorkoutModalOpen}
          onClose={() => setIsWorkoutModalOpen(false)}
          workouts={selectedCourse.workouts}
          courseName={selectedCourse.name}
          onStartWorkout={handleStartWorkout}
        />
      )}
    </>
  );
};

export default ProfilePage;
