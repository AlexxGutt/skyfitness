import React from "react";
import { render, screen } from "@testing-library/react";
import CardItems from "./CardItems";
import * as store from "@/store/store";
import { useCourseProgress } from "@/hooks/useCourseProgress";

// Мокаем useAppSelector
jest.mock("@/store/store", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/hooks/useCourseProgress", () => ({
  useCourseProgress: jest.fn(),
}));

jest.mock("@/components/Card/Card", () => {
  return function MockCard({
    course,
    variant,
    progress,
  }: {
    course: { nameRU: string };
    variant: string;
    progress: number;
  }) {
    return (
      <div data-testid="mock-card">
        <span>{course.nameRU}</span>
        <span>variant: {variant}</span>
        <span>progress: {progress}</span>
      </div>
    );
  };
});

jest.mock("@/components/Loader/Loader", () => {
  return function MockLoader({ text }: { text: string }) {
    return <div data-testid="loader">Загрузка {text}...</div>;
  };
});

// Тестовые данные
const mockCourses = [
  {
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
  },
  {
    _id: "course-2",
    nameRU: "Фитнес",
    nameEN: "Fitness",
    description: "Описание",
    durationInDays: 20,
    difficulty: "средний",
    dailyDurationInMinutes: { from: 30, to: 45 },
    fitting: ["Для опытных"],
    directions: ["Кардио"],
    workouts: ["workout-2"],
    order: 2,
    __v: 0,
  },
];

describe("CardItems Component", () => {
  const mockGetCourseProgress = jest.fn();
  const mockUseAppSelector = store.useAppSelector as jest.MockedFunction<
    typeof store.useAppSelector
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCourseProgress as jest.Mock).mockReturnValue({
      getCourseProgress: mockGetCourseProgress,
    });
  });

  // ============================================
  // 1. ТЕСТЫ СОСТОЯНИЯ ЗАГРУЗКИ
  // ============================================
  describe("Состояние загрузки", () => {
    it("должен показывать лоадер когда isLoading = true", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: true,
        error: null,
      });

      render(<CardItems />);

      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });

  // ============================================
  // 2. ТЕСТЫ ОШИБКИ
  // ============================================
  describe("Состояние ошибки", () => {
    it("должен показывать сообщение об ошибке", () => {
      const errorMessage = "Ошибка загрузки курсов";
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
        error: errorMessage,
      });

      render(<CardItems />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  // ============================================
  // 3. ТЕСТЫ ПУСТОГО СОСТОЯНИЯ
  // ============================================
  describe("Пустое состояние", () => {
    it('должен показывать сообщение "Курсы не найдены" для типа "all"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
        error: null,
      });

      render(<CardItems type="all" />);

      expect(screen.getByText("Курсы не найдены")).toBeInTheDocument();
    });

    it('должен показывать сообщение "У вас пока нет добавленных курсов" для типа "user"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: [],
        isLoading: false,
        error: null,
      });

      render(<CardItems type="user" courseIds={["course-1"]} />);

      expect(
        screen.getByText("У вас пока нет добавленных курсов"),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // 4. ТЕСТЫ ОТОБРАЖЕНИЯ КУРСОВ
  // ============================================
  describe("Отображение курсов", () => {
    it('должен отображать все курсы для типа "all"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(50);

      render(<CardItems type="all" />);

      expect(screen.getByText("Йога")).toBeInTheDocument();
      expect(screen.getByText("Фитнес")).toBeInTheDocument();
    });

    it('должен отображать только выбранные курсы для типа "user"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(75);

      render(<CardItems type="user" courseIds={["course-1"]} />);

      expect(screen.getByText("Йога")).toBeInTheDocument();
      expect(screen.queryByText("Фитнес")).not.toBeInTheDocument();
    });

    it('должен передавать правильный variant для типа "user"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(50);

      render(<CardItems type="user" courseIds={["course-1"]} />);

      expect(screen.getByText("variant: delete")).toBeInTheDocument();
    });

    it('должен передавать правильный variant для типа "all"', () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(50);

      render(<CardItems type="all" />);

      // Используем getAllByText и проверяем первый элемент
      const variants = screen.getAllByText(/variant: add/);
      expect(variants.length).toBe(2);
      expect(variants[0]).toBeInTheDocument();
    });

    it("должен передавать прогресс в Card компонент", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(80);

      render(<CardItems type="all" />);

      // Используем getAllByText и проверяем первый элемент
      const progresses = screen.getAllByText(/progress: 80/);
      expect(progresses.length).toBe(2);
      expect(progresses[0]).toBeInTheDocument();
    });
  });

  // ============================================
  // 5. ТЕСТЫ ПРОГРЕССА
  // ============================================
  describe("Расчет прогресса", () => {
    it("должен вызывать getCourseProgress для каждого курса", () => {
      mockUseAppSelector.mockReturnValue({
        allCourses: mockCourses,
        isLoading: false,
        error: null,
      });
      mockGetCourseProgress.mockReturnValue(0);

      render(<CardItems type="all" />);

      expect(mockGetCourseProgress).toHaveBeenCalledTimes(2);
      expect(mockGetCourseProgress).toHaveBeenCalledWith("course-1");
      expect(mockGetCourseProgress).toHaveBeenCalledWith("course-2");
    });
  });
});
