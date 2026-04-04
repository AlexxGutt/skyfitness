/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

// Мокаем все зависимости
jest.mock("@/store/store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({ access: true }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/service/api/apiCourse", () => ({
  getAddCourse: jest.fn(),
  getDeleteCourse: jest.fn(),
}));

jest.mock("@/hooks/useResetCourseProgress", () => ({
  useResetCourseProgress: () => ({
    resetProgress: jest.fn(),
  }),
}));

// Мок для next/image с alt
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img alt="mock-image" {...props} />;
  },
}));

// Полные тестовые данные
const mockCourse = {
  _id: "course-123",
  nameRU: "Йога",
  nameEN: "Yoga",
  description: "Описание курса йоги",
  durationInDays: 30,
  difficulty: "начальный",
  dailyDurationInMinutes: { from: 15, to: 30 },
  fitting: ["Для начинающих", "Для опытных"],
  directions: ["Хатха-йога", "Кундалини"],
  workouts: ["workout-1", "workout-2"],
  order: 1,
  __v: 0,
};

describe("Card Component", () => {
  it("должен отображать название курса", () => {
    render(<Card course={mockCourse} />);
    expect(screen.getByText("Йога")).toBeInTheDocument();
  });

  it("должен отображать количество дней", () => {
    render(<Card course={mockCourse} />);
    expect(screen.getByText(/30\s*дней/)).toBeInTheDocument();
  });

  it("должен отображать продолжительность тренировки", () => {
    render(<Card course={mockCourse} />);
    expect(screen.getByText(/мин\/день/)).toBeInTheDocument();
  });

  it("должен отображать сложность курса", () => {
    render(<Card course={mockCourse} />);
    expect(screen.getByText("Начальная")).toBeInTheDocument();
  });
});
