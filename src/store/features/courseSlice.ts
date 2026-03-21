import { CourseType } from "@/sharedTypes/sharedTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type initialStateType = {
  allCourses: CourseType[];
  fetchError: null | string;
};
const initialState: initialStateType = {
  allCourses: [],
  fetchError: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
    },
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
  },
});

export const { setAllCourses, setFetchError } = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
