/* eslint-disable */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthModal from "./AuthModal";
import { getSignIn } from "@/service/api/apiAuth";

const mockDispatch = jest.fn();
const mockUseAppSelector = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => mockUseAppSelector(),
}));

jest.mock("@/service/api/apiAuth", () => ({
  getSignIn: jest.fn(),
  getSignUp: jest.fn(),
}));

jest.mock("@/components/Modal/NotificationModal", () => {
  return function MockNotificationModal({
    isOpen,
    type,
    message,
    onClose,
  }: any) {
    return isOpen ? (
      <div data-testid="notification-modal">
        <span>Type: {type}</span>
        <span>Message: {message}</span>
        <button onClick={onClose}>Close Notification</button>
      </div>
    ) : null;
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("AuthModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSwitchMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockReturnValue({ isLoading: false });
  });

  describe("Отображение", () => {
    it("не должен отображать модальное окно когда isOpen = false", () => {
      render(
        <AuthModal
          isOpen={false}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      expect(screen.queryByText("Эл. почта")).not.toBeInTheDocument();
    });

    it("должен отображать форму входа для mode sign-in", () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      expect(screen.getByPlaceholderText("Эл. почта")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
      expect(screen.getByText("Войти")).toBeInTheDocument();
      expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
    });

    it("должен отображать форму регистрации для mode sign-up", () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-up"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      expect(screen.getByPlaceholderText("Эл. почта")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Повторите пароль"),
      ).toBeInTheDocument();
      expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
      expect(screen.getByText("Войти")).toBeInTheDocument();
    });
  });

  describe("Валидация формы", () => {
    it("должен показывать ошибку при пустом email", async () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText("Введите email")).toBeInTheDocument();
      });
    });

    it("должен показывать ошибку при пустом пароле", async () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const emailInput = screen.getByPlaceholderText("Эл. почта");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText("Введите пароль")).toBeInTheDocument();
      });
    });

    it("должен показывать ошибку при несовпадении паролей для регистрации", async () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-up"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const emailInput = screen.getByPlaceholderText("Эл. почта");
      const passwordInput = screen.getByPlaceholderText("Пароль");
      const confirmInput = screen.getByPlaceholderText("Повторите пароль");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password456" } });

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText("Пароли не совпадают")).toBeInTheDocument();
      });
    });
  });

  describe("Успешный вход", () => {
    it("должен успешно войти и закрыть модальное окно", async () => {
      const mockToken = "test-token-123";
      (getSignIn as jest.Mock).mockResolvedValue({
        data: { token: mockToken },
      });

      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const emailInput = screen.getByPlaceholderText("Эл. почта");
      const passwordInput = screen.getByPlaceholderText("Пароль");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      const submitButton = screen.getByText("Войти");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(getSignIn).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("Переключение режима", () => {
    it("должен переключать режим при клике на кнопку", () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const switchButton = screen.getByText("Зарегистрироваться");
      fireEvent.click(switchButton);

      expect(mockOnSwitchMode).toHaveBeenCalled();
    });
  });

  describe("Закрытие", () => {
    it("должен закрывать модальное окно при клике на кнопку закрытия", () => {
      render(
        <AuthModal
          isOpen={true}
          mode="sign-in"
          onClose={mockOnClose}
          onSwitchMode={mockOnSwitchMode}
        />,
      );

      const closeButton = screen.getByText("×");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
