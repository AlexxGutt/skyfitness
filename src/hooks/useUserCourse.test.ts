import { renderHook, act } from "@testing-library/react";
import { getUsersCourse } from "@/service/api/apiCourse";
import { useUserData } from "./useUserCourse";

const mockDispatch = jest.fn();

jest.mock("@/store/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({ access: true }),
}));

jest.mock("@/service/api/apiCourse", () => ({
  getUsersCourse: jest.fn(),
}));

jest.mock("@/store/features/courseSlice", () => ({
  setUsersCourse: jest.fn(),
}));

describe("useUserData", () => {
  const mockShowNotification = jest.fn();
  const mockGetUsersCourse = getUsersCourse as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUsersCourse.mockResolvedValue({ data: { user: {} } });
  });

  it("должен загружать данные пользователя", async () => {
    const { result } = renderHook(() => useUserData());

    await act(async () => {
      await result.current.fetchUserData();
    });

    expect(mockGetUsersCourse).toHaveBeenCalled();
  });

  it("должен показывать уведомление при ошибке", async () => {
    const error = {
      isAxiosError: true,
      response: { data: { message: "Ошибка" } },
    };
    mockGetUsersCourse.mockRejectedValue(error);

    const { result } = renderHook(() => useUserData(mockShowNotification));

    await act(async () => {
      await result.current.fetchUserData();
    });

    expect(mockShowNotification).toHaveBeenCalled();
  });

  it("должен обрабатывать сетевую ошибку", async () => {
    const networkError = { isAxiosError: true, request: {} };
    mockGetUsersCourse.mockRejectedValue(networkError);

    const { result } = renderHook(() => useUserData(mockShowNotification));

    await act(async () => {
      await result.current.fetchUserData();
    });

    expect(mockShowNotification).toHaveBeenCalledWith("Ошибка");
  });

  it("должен сохранять ссылку на функцию между рендерами", () => {
    const { result, rerender } = renderHook(() => useUserData());

    const firstFetch = result.current.fetchUserData;
    rerender();
    const secondFetch = result.current.fetchUserData;

    expect(firstFetch).toBe(secondFetch);
  });
});
