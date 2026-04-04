import { renderHook, act } from "@testing-library/react";
import { useLogout } from "./useLogout";

const mockDispatch = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("@/store/features/authSlice", () => ({
  clearUser: jest.fn(),
}));

jest.mock("@/store/features/loaderSlice", () => ({
  setLoading: jest.fn(),
}));

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useLogout", () => {
  const mockShowNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен очистить данные при выходе", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("должен обрабатывать ошибки", async () => {
    const mockError = new Error("Ошибка");
    localStorage.removeItem = jest.fn().mockImplementation(() => {
      throw mockError;
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout({
        showNotification: mockShowNotification,
      });
    });

    expect(mockShowNotification).toHaveBeenCalledWith("Ошибка при выходе");

    consoleSpy.mockRestore();
  });
});
