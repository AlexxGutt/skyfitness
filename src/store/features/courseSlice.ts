import { CourseType, UserType } from "@/sharedTypes/sharedTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type initialStateType = {
  allCourses: CourseType[];
  usersCourse: UserType | null;
  currentCourse: CourseType | null;
  isLoading: boolean;
  error: null | string;
};

const initialState: initialStateType = {
  usersCourse: null,
  allCourses: [],
  currentCourse: null,
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
} = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
