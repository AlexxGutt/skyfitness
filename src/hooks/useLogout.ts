import { useAppDispatch } from "@/store/store";
import { clearUser } from "@/store/features/authSlice";
import { setLoading } from "@/store/features/loaderSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const logout = async (options?: {
    showNotification?: (message: string) => void;
    redirectTo?: string;
  }) => {
    dispatch(setLoading(true));

    try {
      dispatch(clearUser());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");

      const currentPath = window.location.pathname;

      const isOnCoursePage = currentPath.startsWith("/course/");

      if (isOnCoursePage) {
        options?.showNotification?.("Вы вышли из аккаунта");
      } else {
        const redirectUrl = options?.redirectTo || "/";
        window.location.replace(redirectUrl);
      }
    } catch (error) {
      console.error("Logout error:", error);
      options?.showNotification?.("Ошибка при выходе");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { logout };
};
