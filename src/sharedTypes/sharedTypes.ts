export interface DailyDurationInMinutes {
  from: number;
  to: number;
}

export interface CourseType {
  _id: string;
  nameEN: string;
  nameRU: string;
  description: string;
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: DailyDurationInMinutes;
  directions: string[];
  fitting: string[];
  workouts: string[];
  order: number;
  __v: number;
}

export interface CoursesResponse {
  data: CourseType[];
  total: number;
  success: boolean;
}

export interface AuthType {
  email: string;
  password: string;
}

export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
  _id: string;
};

export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
  _id: string;
};

export interface UserType {
  _id: string;
  email: string;
  selectedCourses: string[];
  courseProgress: CourseProgress[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
