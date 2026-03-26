"use client";

import { useAppSelector } from "@/store/store";
import Card from "@/components/Card/Card";
import Loader from "@/components/Loader/Loader";
import { CourseType } from "@/sharedTypes/sharedTypes";
import styles from "./cardItems.module.css";

type CardItemsProps = {
  type?: "all" | "user";
  courseIds?: string[]; // ← добавляем пропс для ID курсов пользователя
};

const CardItems = ({ type = "all", courseIds = [] }: CardItemsProps) => {
  const { allCourses, isLoading, error } = useAppSelector(
    (state) => state.courses,
  );

  const safeAllCourses = allCourses || [];

  let courses: CourseType[] = [];

  if (type === "all") {
    courses = safeAllCourses;
  } else {
    // Фильтруем курсы по переданным ID
    if (safeAllCourses.length > 0 && courseIds.length > 0) {
      courses = safeAllCourses.filter((course) =>
        courseIds.includes(course._id),
      );
    }
  }

  if (isLoading) {
    return (
      <section className={styles.section}>
        <Loader text="курсы" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.empty}>
          {type === "user"
            ? "У вас пока нет добавленных курсов"
            : "Курсы не найдены"}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {courses.map((course) => (
          <Card key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CardItems;
