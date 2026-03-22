import { CourseType } from "@/sharedTypes/sharedTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type initialStateType = {
  allCourses: CourseType[];
  isLoading: boolean;
  error: null | string;
};
const initialState: initialStateType = {
  allCourses: [],
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

export const { setAllCourses, setError, setLoading, clearError } =
  courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
