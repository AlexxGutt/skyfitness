import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { courseSliceReducer } from "./features/courseSlice";

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      courses: courseSliceReducer,
    }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
