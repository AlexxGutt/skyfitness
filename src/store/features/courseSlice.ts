import { CourseType, UserType } from "@/sharedTypes/sharedTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout } from "@/components/Modal/WorkoutModal";

export type initialStateType = {
  allCourses: CourseType[];
  usersCourse: UserType | null;
  currentCourse: CourseType | null;
  currentWorkout: Workout | null;
  currentProgressWorkout: Record<string, number> | null;
  isLoading: boolean;
  error: null | string;
};

const initialState: initialStateType = {
  usersCourse: null,
  allCourses: [],
  currentCourse: null,
  currentWorkout: null,
  currentProgressWorkout: null,
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
      state.isLoading = false;
    },
    setUsersCourse: (state, action: PayloadAction<UserType>) => {
      state.usersCourse = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<CourseType>) => {
      state.currentCourse = action.payload;
      localStorage.setItem("currentCourse", JSON.stringify(action.payload));
    },
    setCurrentWorkout: (state, action: PayloadAction<Workout>) => {
      state.currentWorkout = action.payload;
      localStorage.setItem("currentWorkout", JSON.stringify(action.payload));
    },
    setCurrentProgressWorkout: (
      state,
      action: PayloadAction<Record<string, number>>,
    ) => {
      state.currentProgressWorkout = action.payload;
      localStorage.setItem(
        "currentProgressWorkout",
        JSON.stringify(action.payload),
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAllCourses,
  setError,
  setLoading,
  clearError,
  setUsersCourse,
  setCurrentCourse,
  setCurrentWorkout,
  setCurrentProgressWorkout,
} = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
