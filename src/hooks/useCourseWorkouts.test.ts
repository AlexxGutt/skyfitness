/* eslint-disable */
import { renderHook, act } from "@testing-library/react";
import { useCourseWorkouts } from "./useCourseWorkouts";
import { getCourseWorkout } from "@/service/api/apiWorkout";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/service/api/apiWorkout", () => ({
  getCourseWorkout: jest.fn(),
}));

jest.mock("@/hooks/useSortWorkouts", () => ({
  useSortWorkouts: () => ({
    sortWorkouts: (data: any) => data,
  }),
}));

jest.mock("@/store/store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({
    access: true,
    allCourses: [],
  }),
}));

describe("useCourseWorkouts", () => {
  const mockGetCourseWorkout = getCourseWorkout as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCourseWorkout.mockResolvedValue({ data: [] });
  });

  it("должен иметь начальное состояние", () => {
    const { result } = renderHook(() => useCourseWorkouts());

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.selectedWorkouts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("должен закрывать модальное окно", async () => {
    const { result } = renderHook(() => useCourseWorkouts());

    act(() => {
      result.current.closeWorkoutsModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it("должен запускать тренировку", () => {
    const { result } = renderHook(() => useCourseWorkouts());

    act(() => {
      result.current.startWorkout("workout-123");
    });

    expect(mockPush).toHaveBeenCalledWith("/workout/workout-123");
  });
});
