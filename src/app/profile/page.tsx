"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import CardItems from "@/components/CardItems/CardItems";
import styles from "./page.module.css";
import { useEffect } from "react";
import { getUsersCourse } from "@/service/api/apiUsersCourse";
import { setError, setUsersCourse } from "@/store/features/courseSlice";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { username, email, access } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (access) {
      getUsersCourse(access)
        .then((res) => {
          console.log("Данные пользователя:", res.data);
          // Сохраняем все данные пользователя в store
          dispatch(setUsersCourse(res.data.user));
        })
        .catch((err) => {
          console.log("Ошибка:", err);
          dispatch(setError(err.message || "Ошибка загрузки курсов"));
        });
    }
  }, [access, dispatch]);

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  // Получаем ID выбранных курсов из userData
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

          {/* Блок "Мои курсы" */}
          <div className={styles.coursesSection}>
            <h1 className={styles.coursesTitle}>Мои курсы</h1>
            <CardItems type="user" courseIds={selectedCourseIds} />
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
