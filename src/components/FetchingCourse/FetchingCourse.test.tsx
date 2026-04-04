import { render, waitFor } from "@testing-library/react";
import { useDispatch } from "react-redux";
import * as store from "@/store/store";
import { useUserData } from "@/hooks/useUserCourse";
import { getAllCours } from "@/service/api/apiCourse";
import {
  setAllCourses,
  setError,
  setLoading,
} from "@/store/features/courseSlice";
import FetchingCourses from "./FetchingCourse";
import { AxiosError } from "axios";

// Мокаем зависимости
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("@/store/store", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/hooks/useUserCourse", () => ({
  useUserData: jest.fn(),
}));

jest.mock("@/service/api/apiCourse", () => ({
  getAllCours: jest.fn(),
}));

jest.mock("@/store/features/courseSlice", () => ({
  setAllCourses: jest.fn(),
  setError: jest.fn(),
  setLoading: jest.fn(),
}));

const mockCourse = {
  _id: "course-1",
  nameRU: "Йога",
  nameEN: "Yoga",
  description: "Описание",
  durationInDays: 30,
  difficulty: "начальный",
  dailyDurationInMinutes: { from: 15, to: 30 },
  fitting: ["Для начинающих"],
  directions: ["Хатха"],
  workouts: ["workout-1"],
  order: 1,
  __v: 0,
};

describe("FetchingCourses Component", () => {
  const mockDispatch = jest.fn();
  const mockFetchUserData = jest.fn();
  const mockUseAppSelector = store.useAppSelector as jest.MockedFunction<
    typeof store.useAppSelector
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useUserData as jest.Mock).mockReturnValue({
      fetchUserData: mockFetchUserData,
    });
  });

  describe("Загрузка курсов", () => {
    it("должен загружать курсы если allCourses пустой и isLoading false", async () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });
      (getAllCours as jest.Mock).mockResolvedValue([mockCourse]);

      render(<FetchingCourses />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
        expect(getAllCours).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(setAllCourses([mockCourse]));
      });
    });

    it("не должен загружать курсы если allCourses не пустой", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [mockCourse],
        isLoading: false,
      });

      render(<FetchingCourses />);

      expect(getAllCours).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalledWith(setLoading(true));
    });

    it("не должен загружать курсы если isLoading true", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: true,
      });

      render(<FetchingCourses />);

      expect(getAllCours).not.toHaveBeenCalled();
    });
  });

  describe("Обработка ошибок", () => {
    it("должен обрабатывать ошибку с response", async () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });

      const errorResponse = { response: { data: "Ошибка сервера" } };
      (getAllCours as jest.Mock).mockRejectedValue(errorResponse as AxiosError);

      render(<FetchingCourses />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(setError("Ошибка сервера"));
      });
    });

    it("должен обрабатывать ошибку без response (network error)", async () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });

      const networkError = { request: {} };
      (getAllCours as jest.Mock).mockRejectedValue(networkError as AxiosError);

      render(<FetchingCourses />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          setError("Произошла ошибка. Попробуйте позже"),
        );
      });
    });

    it("должен обрабатывать неизвестную ошибку", async () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });

      (getAllCours as jest.Mock).mockRejectedValue(new Error("Unknown error"));

      render(<FetchingCourses />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          setError("Неизвестная ошибка"),
        );
      });
    });
  });

  describe("Загрузка данных пользователя", () => {
    it("должен вызывать fetchUserData при монтировании", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });
      (getAllCours as jest.Mock).mockResolvedValue([]);

      render(<FetchingCourses />);

      expect(mockFetchUserData).toHaveBeenCalledTimes(1);
    });
  });

  describe("Рендеринг", () => {
    it("компонент не должен ничего отображать (возвращает null)", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
      });
      (getAllCours as jest.Mock).mockResolvedValue([]);

      const { container } = render(<FetchingCourses />);

      expect(container.firstChild).toBeNull();
    });
  });
});
