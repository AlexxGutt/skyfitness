import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProgressModal from "./ProgressModal";

const mockDispatch = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("@/store/features/loaderSlice", () => ({
  setLoading: jest.fn(),
}));

jest.mock("@/components/Loader/GlobalLoader", () => {
  return function MockGlobalLoader() {
    return <div data-testid="global-loader">Loading...</div>;
  };
});

jest.mock("@/hooks/useCustomScroll", () => ({
  useCustomScroll: () => ({
    listRef: { current: null },
    thumbRef: { current: null },
    thumbTop: 0,
    thumbHeight: 100,
    visible: false,
  }),
}));

jest.mock("@/hooks/useParseExerciseName", () => ({
  useParseExerciseName: () => ({
    parseExerciseName: (name: string) => name.split(" / ")[0],
  }),
}));

const mockExercises = [
  { _id: "ex-1", name: "Упражнение 1", quantity: 10 },
  { _id: "ex-2", name: "Упражнение 2", quantity: 15 },
  { _id: "ex-3", name: "Упражнение 3", quantity: 20 },
];

describe("ProgressModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Отображение", () => {
    it("не должен отображать модальное окно когда isOpen = false", () => {
      render(
        <ProgressModal
          isOpen={false}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      expect(screen.queryByText("Мой прогресс")).not.toBeInTheDocument();
    });

    it("должен отображать модальное окно когда isOpen = true", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      expect(screen.getByText("Мой прогресс")).toBeInTheDocument();
      expect(screen.getByText("Сохранить")).toBeInTheDocument();
    });

    it("должен отображать все упражнения", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      expect(screen.getByText(/Упражнение 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Упражнение 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Упражнение 3/i)).toBeInTheDocument();
    });
  });

  describe("Видео-режим", () => {
    it("должен отображать видео-вопрос когда isVideoOnly = true", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={[]}
          isVideoOnly={true}
        />,
      );

      expect(screen.getByText("Вы посмотрели видеоурок?")).toBeInTheDocument();
      expect(screen.getByText("Да")).toBeInTheDocument();
      expect(screen.getByText("Нет")).toBeInTheDocument();
    });

    it("должен устанавливать прогресс 100% при выборе 'Да'", async () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={[]}
          isVideoOnly={true}
          onSave={mockOnSave}
        />,
      );

      const yesButton = screen.getByText("Да");
      fireEvent.click(yesButton);

      const saveButton = screen.getByText("Сохранить");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ video: 100 });
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("должен устанавливать прогресс 0% при выборе 'Нет'", async () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={[]}
          isVideoOnly={true}
          onSave={mockOnSave}
        />,
      );

      const noButton = screen.getByText("Нет");
      fireEvent.click(noButton);

      const saveButton = screen.getByText("Сохранить");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ video: 0 });
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("Ввод данных", () => {
    it("должен обновлять значение инпута при вводе", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      const input = screen.getAllByPlaceholderText("0")[0];
      fireEvent.change(input, { target: { value: "5" } });

      expect(input).toHaveValue(5);
    });

    it("должен ограничивать значение максимальным quantity", async () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
          onSave={mockOnSave}
        />,
      );

      const input = screen.getAllByPlaceholderText("0")[0];
      fireEvent.change(input, { target: { value: "100" } });

      const saveButton = screen.getByText("Сохранить");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            "ex-1": 10,
          }),
        );
      });
    });
  });

  describe("Сохранение прогресса", () => {
    it("должен сохранять прогресс и закрывать модальное окно", async () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
          onSave={mockOnSave}
        />,
      );

      const inputs = screen.getAllByPlaceholderText("0");
      fireEvent.change(inputs[0], { target: { value: "5" } });
      fireEvent.change(inputs[1], { target: { value: "10" } });

      const saveButton = screen.getByText("Сохранить");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          "ex-1": 5,
          "ex-2": 10,
          "ex-3": 0,
        });
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("Закрытие", () => {
    it("должен закрывать модальное окно при клике на overlay", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      const overlay = document.querySelector(".overlay");
      fireEvent.click(overlay!);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("должен закрывать модальное окно при нажатии Escape", () => {
      render(
        <ProgressModal
          isOpen={true}
          onClose={mockOnClose}
          exercises={mockExercises}
        />,
      );

      fireEvent.keyDown(window, { key: "Escape" });

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
