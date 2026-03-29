"use client";

import { useAppSelector } from "@/store/store";
import Card from "@/components/Card/Card";
import Loader from "@/components/Loader/Loader";
import { CourseType } from "@/sharedTypes/sharedTypes";
import styles from "./cardItems.module.css";

export type CardItemsProps = {
  type?: "all" | "user";
  courseIds?: string[];
  onCourseChange?: () => void;
  courseProgress?: Record<string, number>;
  onStartCourse?: (courseId: string) => void;
};

const CardItems = ({
  type = "all",
  courseIds = [],
  onCourseChange,
  courseProgress = {},
  onStartCourse,
}: CardItemsProps) => {
  const { allCourses, isLoading, error } = useAppSelector(
    (state) => state.courses,
  );

  const safeAllCourses = allCourses || [];

  let courses: CourseType[] = [];

  if (type === "all") {
    courses = safeAllCourses;
  } else {
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
          <Card
            key={course._id}
            course={course}
            variant={type === "user" ? "delete" : "add"}
            onSuccess={onCourseChange}
            progress={courseProgress[course._id] || 0}
            onStartCourse={onStartCourse} // Добавляем
          />
        ))}
      </div>
    </section>
  );
};

export default CardItems;
