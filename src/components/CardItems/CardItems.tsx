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
  onStartCourse?: (courseId: string) => void;
};

const CardItems = ({
  type = "all",
  courseIds = [],
  onCourseChange,
  onStartCourse,
}: CardItemsProps) => {
  const { allCourses, isLoading, error, usersCourse } = useAppSelector(
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

  const calculateProgress = (courseId: string): number => {
    const courseProgress = usersCourse?.courseProgress?.find(
      (cp) => cp.courseId === courseId,
    );
    if (!courseProgress) return 0;

    const course = safeAllCourses.find((c) => c._id === courseId);
    if (!course || !course.workouts) return 0;

    const totalWorkouts = course.workouts.length;
    const completedWorkouts = courseProgress.workoutsProgress.filter(
      (wp) => wp.workoutCompleted,
    ).length;

    return Math.round((completedWorkouts / totalWorkouts) * 100);
  };

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
            progress={calculateProgress(course._id)}
            onStartCourse={onStartCourse}
          />
        ))}
      </div>
    </section>
  );
};

export default CardItems;
