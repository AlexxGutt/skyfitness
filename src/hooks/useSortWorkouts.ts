import { Workout } from "@/components/Modal/WorkoutModal";

export const useSortWorkouts = () => {
  const sortWorkouts = (workouts: Workout[]): Workout[] => {
    return workouts.sort((a, b) => {
      const aNum = parseInt(a.name.match(/\d+/)?.[0] || "999");
      const bNum = parseInt(b.name.match(/\d+/)?.[0] || "999");
      return aNum - bNum;
    });
  };

  return { sortWorkouts };
};
