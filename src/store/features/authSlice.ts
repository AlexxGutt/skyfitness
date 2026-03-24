import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type initialStateType = {
  username: string;
  access: string;
  refresh: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: initialStateType = {
  username: "",
  access: "",
  refresh: "",
  isLoading: false,
  error: "",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
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
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },
    setAccess: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      localStorage.setItem("access", action.payload);
    },
    setRefresh: (state, action: PayloadAction<string>) => {
      state.refresh = action.payload;
      localStorage.setItem("refresh", action.payload);
    },
    clearUser: (state) => {
      state.username = "";
      state.access = "";
      state.refresh = "";
      localStorage.removeItem("username");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const {
  setUsername,
  setAccess,
  setRefresh,
  clearUser,
  setError,
  setLoading,
  clearError,
} = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
