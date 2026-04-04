/* eslint-disable */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "./Header";

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockSwitchMode = jest.fn();

jest.mock("@/hooks/useAuthModal", () => ({
  useAuthModal: () => ({
    isOpen: false,
    mode: "sign-in",
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
    switchMode: mockSwitchMode,
  }),
}));

let mockAccess = false;
let mockUsername: string | null = null;
let mockEmail: string | null = null;

jest.mock("@/store/store", () => ({
  useAppSelector: () => ({
    access: mockAccess,
    username: mockUsername,
    email: mockEmail,
  }),
}));

jest.mock("@/components/Modal/AuthModal", () => {
  return function MockAuthModal({ isOpen, mode, onClose, onSwitchMode }: any) {
    return isOpen ? (
      <div data-testid="auth-modal">
        <span>Auth Modal: {mode}</span>
        <button onClick={onClose}>Close</button>
        <button onClick={onSwitchMode}>Switch</button>
      </div>
    ) : null;
  };
});

jest.mock("@/components/Modal/UserModal", () => {
  return function MockProfileDropdown({ isOpen, onClose }: any) {
    return isOpen ? (
      <div data-testid="profile-dropdown">
        <span>Profile Dropdown</span>
        <button onClick={onClose}>Close</button>
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

jest.mock("next/link", () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccess = false;
    mockUsername = null;
    mockEmail = null;
  });

  describe("Отображение", () => {
    it("должен отображать логотип и подзаголовок", () => {
      render(<Header />);
      expect(
        screen.getByAltText("Логотип Fitness Training"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Онлайн-тренировки для занятий дома"),
      ).toBeInTheDocument();
    });

    it('должен отображать кнопку "Войти" для неавторизованного пользователя', () => {
      render(<Header />);
      expect(screen.getByText("Войти")).toBeInTheDocument();
    });

    it("должен отображать информацию об авторизованном пользователе", () => {
      mockAccess = true;
      mockUsername = "Александр";
      mockEmail = "alex@example.com";

      render(<Header />);
      expect(screen.getByText("Александр")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  describe("Открытие модального окна авторизации", () => {
    it('должен открывать модальное окно при клике на "Войти"', () => {
      render(<Header />);
      const loginButton = screen.getByText("Войти");
      fireEvent.click(loginButton);
      expect(mockOpenModal).toHaveBeenCalledWith("sign-in");
    });
  });

  describe("Выпадающее меню профиля", () => {
    it("должен открывать выпадающее меню при клике на пользователя", () => {
      mockAccess = true;
      mockUsername = "Александр";
      mockEmail = "alex@example.com";

      render(<Header />);
      const userInfo = screen.getByText("Александр");
      fireEvent.click(userInfo);
      expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
    });

    it("должен закрывать выпадающее меню при клике вне его", async () => {
      mockAccess = true;
      mockUsername = "Александр";
      mockEmail = "alex@example.com";

      render(<Header />);
      const userInfo = screen.getByText("Александр");
      fireEvent.click(userInfo);
      expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      await waitFor(() => {
        expect(
          screen.queryByTestId("profile-dropdown"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
