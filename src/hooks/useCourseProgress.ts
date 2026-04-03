import { useAppSelector } from "@/store/store";
import { CourseType } from "@/sharedTypes/sharedTypes";

export const useCourseProgress = () => {
  const { usersCourse, allCourses } = useAppSelector((state) => state.courses);

  const getCourseProgress = (courseId: string): number => {
    const courseProgress = usersCourse?.courseProgress?.find(
      (cp) => cp.courseId === courseId,
    );
    if (!courseProgress) return 0;

    const course = allCourses?.find((c) => c._id === courseId);
    if (!course || !course.workouts) return 0;

    const totalWorkouts = course.workouts.length;
    const completedWorkouts = courseProgress.workoutsProgress.filter(
      (wp) => wp.workoutCompleted,
    ).length;

    return Math.round((completedWorkouts / totalWorkouts) * 100);
  };

  const getButtonTextByProgress = (progress: number): string => {
    if (progress === 100) return "Начать заново";
    if (progress > 0) return "Продолжить";
    return "Начать";
  };

  const getCourseButtonInfo = (courseId: string) => {
    const progress = getCourseProgress(courseId);
    const isCourseAdded =
      usersCourse?.selectedCourses?.includes(courseId) ?? false;

    return {
      progress,
      isAdded: isCourseAdded,
      buttonText: getButtonTextByProgress(progress),
    };
  };

  const getCourseWithProgress = (course: CourseType) => {
    const progress = getCourseProgress(course._id);
    return {
      ...course,
      progress,
      buttonText: getButtonTextByProgress(progress),
    };
  };

  return {
    getCourseProgress,
    getButtonTextByProgress,
    getCourseButtonInfo,
    getCourseWithProgress,
  };
};
