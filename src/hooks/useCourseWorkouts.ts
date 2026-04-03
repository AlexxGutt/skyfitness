"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCurrentCourse } from "@/store/features/courseSlice";
import { getCourseWorkout } from "@/service/api/apiWorkout";
import { useSortWorkouts } from "@/hooks/useSortWorkouts";
import { Workout } from "@/components/Modal/WorkoutModal";
import axios from "axios";
import { setLoading } from "@/store/features/loaderSlice";

interface UseCourseWorkoutsProps {
  onError?: (message: string) => void;
}

export const useCourseWorkouts = ({ onError }: UseCourseWorkoutsProps = {}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { access } = useAppSelector((state) => state.auth);
  const { allCourses } = useAppSelector((state) => state.courses);
  const { sortWorkouts } = useSortWorkouts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openWorkoutsModal = async (courseId: string) => {
    if (!access) {
      onError?.("Авторизуйтесь, чтобы продолжить");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));
    setCurrentCourseId(courseId);

    try {
      const course = allCourses.find((c) => c._id === courseId);
      if (course) {
        dispatch(setCurrentCourse(course));
      }

      const response = await getCourseWorkout(access, courseId);
      const sortedWorkouts = sortWorkouts(response.data);
      setSelectedWorkouts(sortedWorkouts);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Ошибка загрузки тренировок"
        : "Ошибка загрузки тренировок";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const closeWorkoutsModal = () => {
    setIsModalOpen(false);
    setSelectedWorkouts([]);
    setCurrentCourseId(null);
  };

  const startWorkout = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
    closeWorkoutsModal();
  };

  return {
    isModalOpen,
    selectedWorkouts,
    currentCourseId,
    isLoading,
    openWorkoutsModal,
    closeWorkoutsModal,
    startWorkout,
  };
};
