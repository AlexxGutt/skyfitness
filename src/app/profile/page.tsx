"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import CardItems from "@/components/CardItems/CardItems";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import { getUsersCourse } from "@/service/api/apiCourse";
import { setUsersCourse } from "@/store/features/courseSlice";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { username, email, access } = useAppSelector((state) => state.auth);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserData = useCallback(() => {
    if (access) {
      getUsersCourse(access)
        .then((res) => {
          dispatch(setUsersCourse(res.data.user));
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

  const selectedCourseIds = useAppSelector(
    (state) => state.courses.usersCourse?.selectedCourses || [],
  );

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
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
