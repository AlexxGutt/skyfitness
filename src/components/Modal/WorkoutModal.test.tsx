/* eslint-disable */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkoutModal from "./WorkoutModal";
import { parseWorkoutName } from "@/hooks/parseWorkoutName";

const mockDispatch = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      courses: {
        usersCourse: {
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "workout-1", workoutCompleted: true },
                { workoutId: "workout-2", workoutCompleted: false },
              ],
            },
          ],
        },
      },
    }),
}));

jest.mock("@/store/features/loaderSlice", () => ({
  setLoading: jest.fn(),
}));

jest.mock("@/components/Loader/GlobalLoader", () => {
  return function MockGlobalLoader() {
    return <div data-testid="global-loader">Loading...</div>;
  };
});

jest.mock("@/hooks/parseWorkoutName", () => ({
  parseWorkoutName: jest.fn(),
}));

jest.mock("@/hooks/useCustomScroll", () => ({
  useCustomScroll: () => ({
    listRef: { current: null },
    thumbRef: { current: null },
    thumbTop: 0,
    thumbHeight: 100,
    visible: false,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock("../workoutModal.module.css", () => ({
  overlay: "overlay-mock",
  modal: "modal-mock",
  modalContent: "modalContent-mock",
  title: "title-mock",
  scrollContainer: "scrollContainer-mock",
  workoutsList: "workoutsList-mock",
  workoutItem: "workoutItem-mock",
  selected: "selected-mock",
  disabled: "disabled-mock",
  checkbox: "checkbox-mock",
  workoutInfo: "workoutInfo-mock",
  workoutName: "workoutName-mock",
  workoutDescription: "workoutDescription-mock",
  divider: "divider-mock",
  scrollTrack: "scrollTrack-mock",
  scrollThumb: "scrollThumb-mock",
  startButton: "startButton-mock",
}));

const mockWorkouts = [
  { _id: "workout-1", name: "Yoga / Basic", video: "url1", __v: 0 },
  { _id: "workout-2", name: "Yoga / Advanced / Flow", video: "url2", __v: 0 },
  { _id: "workout-3", name: "Meditation", video: "url3", __v: 0 },
];

describe("WorkoutModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnStartWorkout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (parseWorkoutName as jest.Mock).mockImplementation((name: string) => {
      if (name === "Yoga / Basic")
        return { name: "Yoga", description: "Basic" };
      if (name === "Yoga / Advanced / Flow")
        return { name: "Yoga", description: "Advanced / Flow" };
      return { name, description: "" };
    });
  });

  describe("Отображение", () => {
    it("не должен отображать модальное окно когда isOpen = false", () => {
      render(
        <WorkoutModal
          isOpen={false}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      expect(screen.queryByText("Выберите тренировку")).not.toBeInTheDocument();
    });

    it("должен отображать модальное окно когда isOpen = true", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      expect(screen.getByText("Выберите тренировку")).toBeInTheDocument();
      expect(screen.getByText("Начать")).toBeInTheDocument();
    });

    it("должен отображать список тренировок", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      const yogaElements = screen.getAllByText("Yoga");
      expect(yogaElements.length).toBe(2);
      expect(screen.getByText("Meditation")).toBeInTheDocument();
    });

    it("должен показывать правильный статус завершения тренировки", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      const completedIcon = screen.getAllByAltText("Пройдено")[0];
      const notCompletedIcon = screen.getAllByAltText("Не пройдено")[0];

      expect(completedIcon).toBeInTheDocument();
      expect(notCompletedIcon).toBeInTheDocument();
    });
  });

  describe("Выбор тренировки", () => {
    it("должен выбирать тренировку при клике", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      const yogaElements = screen.getAllByText("Yoga");
      const workoutItem = yogaElements[0].closest(`.workoutItem-mock`);
      fireEvent.click(workoutItem!);

      const startButton = screen.getByText("Начать");
      expect(startButton).not.toBeDisabled();
    });
  });

  describe("Запуск тренировки", () => {
    it("должен запускать тренировку при клике на кнопку Начать", async () => {
      mockOnStartWorkout.mockResolvedValue(undefined);

      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
          onStartWorkout={mockOnStartWorkout}
        />,
      );

      const yogaElements = screen.getAllByText("Yoga");
      const workoutItem = yogaElements[0].closest(`.workoutItem-mock`);
      fireEvent.click(workoutItem!);

      const startButton = screen.getByText("Начать");
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(mockOnStartWorkout).toHaveBeenCalledWith("workout-1");
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("должен показывать лоадер во время запуска", async () => {
      mockOnStartWorkout.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
          onStartWorkout={mockOnStartWorkout}
        />,
      );

      const yogaElements = screen.getAllByText("Yoga");
      const workoutItem = yogaElements[0].closest(`.workoutItem-mock`);
      fireEvent.click(workoutItem!);

      const startButton = screen.getByText("Начать");
      fireEvent.click(startButton);

      expect(screen.getByTestId("global-loader")).toBeInTheDocument();
      expect(screen.getByText("Загрузка...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId("global-loader")).not.toBeInTheDocument();
      });
    });

    it("должен блокировать кнопку если тренировка не выбрана", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
          onStartWorkout={mockOnStartWorkout}
        />,
      );

      const startButton = screen.getByText("Начать");
      expect(startButton).toBeDisabled();
    });
  });

  describe("Закрытие", () => {
    it("должен закрывать модальное окно при нажатии Escape", () => {
      render(
        <WorkoutModal
          isOpen={true}
          onClose={mockOnClose}
          workouts={mockWorkouts}
          courseId="course-123"
        />,
      );

      fireEvent.keyDown(window, { key: "Escape" });

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
