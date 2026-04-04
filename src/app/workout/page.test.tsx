/* eslint-disable */
import { render, screen, waitFor } from "@testing-library/react";
import WorkoutPage from "./[id]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "workout-123" }),
}));

const mockGetDataWorkout = jest.fn();
const mockGetProgressWorkout = jest.fn();

jest.mock("@/service/api/apiWorkout", () => ({
  getDataWorkout: (...args: any[]) => mockGetDataWorkout(...args),
  getProgressWorkout: (...args: any[]) => mockGetProgressWorkout(...args),
  changeProgressWorkout: jest.fn(),
  clearProgressWorkout: jest.fn(),
}));

const mockDispatch = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => {
    const state = {
      auth: { access: true },
      courses: {
        currentCourse: { _id: "course-1", nameRU: "Йога" },
        currentWorkout: {
          _id: "workout-123",
          name: "Утренняя йога",
          video: "https://youtube.com/embed/xxx",
          exercises: [
            { _id: "ex-1", name: "Собака мордой вниз", quantity: 10 },
            { _id: "ex-2", name: "Кобра", quantity: 8 },
          ],
        },
        currentProgressWorkout: { "ex-1": 5, "ex-2": 3 },
        usersCourse: { courseProgress: [] },
      },
    };
    return selector(state);
  },
}));

jest.mock("@/hooks/useParseExerciseName", () => ({
  useParseExerciseName: () => ({
    parseExerciseName: (name: string) => name,
  }),
}));

jest.mock("@/hooks/useProgressStatus", () => ({
  useProgressStatus: () => ({
    status: "start",
    buttonText: "Внести прогресс",
  }),
}));

jest.mock("@/hooks/useRestoreCurrentCourse", () => ({
  useRestoreCurrentCourse: () => {},
}));

jest.mock("@/hooks/useRestoreCurrentWorkout", () => ({
  useRestoreCurrentWorkout: () => {},
}));

jest.mock("@/hooks/useRestoreCurrentProgressWorkout", () => ({
  useRestoreCurrentProgressWorkout: () => {},
}));

jest.mock("@/components/Header/Header", () => () => <div>Header</div>);
jest.mock("@/components/Modal/ProgressModal", () => () => (
  <div>ProgressModal</div>
));
jest.mock("@/components/Modal/NotificationModal", () => () => null);
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));

jest.mock("./page.module.css", () => ({
  container: "container",
  content: "content",
  title: "title",
  videoFrame: "videoFrame",
  exercisesCard: "exercisesCard",
  exercisesBlock: "exercisesBlock",
  exercisesTitle: "exercisesTitle",
  exercisesList: "exercisesList",
  exerciseItem: "exerciseItem",
  exerciseName: "exerciseName",
  progressBar: "progressBar",
  progressFill: "progressFill",
  fillButton: "fillButton",
  loading: "loading",
}));

describe("WorkoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetDataWorkout.mockResolvedValue({
      data: {
        _id: "workout-123",
        name: "Утренняя йога",
        video: "https://youtube.com/embed/xxx",
        exercises: [
          { _id: "ex-1", name: "Собака мордой вниз", quantity: 10 },
          { _id: "ex-2", name: "Кобра", quantity: 8 },
        ],
      },
    });

    mockGetProgressWorkout.mockResolvedValue({
      data: {
        progressData: [5, 3],
      },
    });
  });

  it("должен отображать название тренировки", async () => {
    render(<WorkoutPage />);
    await waitFor(() => {
      expect(screen.getByTitle("Утренняя йога")).toBeInTheDocument();
    });
  });

  it("должен отображать название курса", async () => {
    render(<WorkoutPage />);
    await waitFor(() => {
      expect(screen.getByText("Йога")).toBeInTheDocument();
    });
  });

  it("должен отображать кнопку для внесения прогресса", async () => {
    render(<WorkoutPage />);
    await waitFor(() => {
      expect(screen.getByText("Внести прогресс")).toBeInTheDocument();
    });
  });

  it("должен отображать список упражнений", async () => {
    render(<WorkoutPage />);
    await waitFor(() => {
      expect(screen.getByText(/Собака мордой вниз/i)).toBeInTheDocument();
      expect(screen.getByText(/Кобра/i)).toBeInTheDocument();
    });
  });
});
