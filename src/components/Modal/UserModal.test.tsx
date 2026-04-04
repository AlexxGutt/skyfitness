/* eslint-disable */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileDropdown from "./UserModal";

const mockDispatch = jest.fn();
const mockPush = jest.fn();
const mockLogout = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      auth: { username: "Тест", email: "test@example.com" },
    }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

jest.mock("@/store/features/loaderSlice", () => ({
  setLoading: jest.fn(),
}));

jest.mock("@/components/Loader/GlobalLoader", () => {
  return function MockGlobalLoader() {
    return <div data-testid="global-loader">Loading...</div>;
  };
});

jest.mock("../userModal.module.css", () => ({
  dropdown: "dropdown-mock",
  userInfo: "userInfo-mock",
  userName: "userName-mock",
  userEmail: "userEmail-mock",
  buttonsContainer: "buttonsContainer-mock",
  profileButton: "profileButton-mock",
  logoutButton: "logoutButton-mock",
}));

describe("ProfileDropdown Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogout.mockResolvedValue(undefined);
  });

  describe("Отображение", () => {
    it("не должен отображать выпадающее меню когда isOpen = false", () => {
      render(<ProfileDropdown isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByText("Тест")).not.toBeInTheDocument();
    });

    it("должен отображать выпадающее меню когда isOpen = true", () => {
      render(<ProfileDropdown isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Тест")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("Мой профиль")).toBeInTheDocument();
      expect(screen.getByText("Выйти")).toBeInTheDocument();
    });
  });

  describe("Навигация в профиль", () => {
    it("должен переходить на страницу профиля при клике на кнопку", () => {
      render(<ProfileDropdown isOpen={true} onClose={mockOnClose} />);

      const profileButton = screen.getByText("Мой профиль");
      fireEvent.click(profileButton);

      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/profile");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Выход из аккаунта", () => {
    it("должен вызывать logout при клике на кнопку выхода", async () => {
      render(<ProfileDropdown isOpen={true} onClose={mockOnClose} />);

      const logoutButton = screen.getByText("Выйти");
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledWith({ redirectTo: "/" });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("должен показывать лоадер во время выхода", async () => {
      mockLogout.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<ProfileDropdown isOpen={true} onClose={mockOnClose} />);

      const logoutButton = screen.getByText("Выйти");
      fireEvent.click(logoutButton);

      expect(screen.getByTestId("global-loader")).toBeInTheDocument();
      expect(screen.getByText("Выход...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId("global-loader")).not.toBeInTheDocument();
      });
    });

    it("должен блокировать кнопку выхода во время операции", () => {
      mockLogout.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<ProfileDropdown isOpen={true} onClose={mockOnClose} />);

      const logoutButton = screen.getByText("Выйти");
      fireEvent.click(logoutButton);

      expect(logoutButton).toBeDisabled();
    });
  });
});
