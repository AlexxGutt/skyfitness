import { renderHook } from "@testing-library/react";
import { useCourseProgress } from "./useCourseProgress";
import { useAppSelector } from "@/store/store";

jest.mock("@/store/store", () => ({
  useAppSelector: jest.fn(),
}));

const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;

describe("useCourseProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCourseProgress", () => {
    it("должен возвращать 0, если нет прогресса по курсу", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          courseProgress: [],
          selectedCourses: [],
        },
        allCourses: [],
      });

      const { result } = renderHook(() => useCourseProgress());
      const progress = result.current.getCourseProgress("course-123");

      expect(progress).toBe(0);
    });

    it("должен возвращать 0, если курс не найден", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "w1", workoutCompleted: true },
                { workoutId: "w2", workoutCompleted: false },
              ],
            },
          ],
        },
        allCourses: [],
      });

      const { result } = renderHook(() => useCourseProgress());
      const progress = result.current.getCourseProgress("course-123");

      expect(progress).toBe(0);
    });

    it("должен правильно рассчитывать прогресс (2 из 3 тренировок выполнено = 67%)", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "w1", workoutCompleted: true },
                { workoutId: "w2", workoutCompleted: true },
                { workoutId: "w3", workoutCompleted: false },
              ],
            },
          ],
        },
        allCourses: [
          {
            _id: "course-123",
            workouts: ["w1", "w2", "w3"],
          },
        ],
      });

      const { result } = renderHook(() => useCourseProgress());
      const progress = result.current.getCourseProgress("course-123");

      expect(progress).toBe(67);
    });

    it("должен возвращать 100%, если все тренировки выполнены", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "w1", workoutCompleted: true },
                { workoutId: "w2", workoutCompleted: true },
              ],
            },
          ],
        },
        allCourses: [
          {
            _id: "course-123",
            workouts: ["w1", "w2"],
          },
        ],
      });

      const { result } = renderHook(() => useCourseProgress());
      const progress = result.current.getCourseProgress("course-123");

      expect(progress).toBe(100);
    });
  });

  describe("getButtonTextByProgress", () => {
    it("должен возвращать 'Начать' при прогрессе 0", () => {
      const { result } = renderHook(() => useCourseProgress());
      const text = result.current.getButtonTextByProgress(0);
      expect(text).toBe("Начать");
    });

    it("должен возвращать 'Продолжить' при прогрессе от 1 до 99", () => {
      const { result } = renderHook(() => useCourseProgress());
      const text50 = result.current.getButtonTextByProgress(50);
      const text75 = result.current.getButtonTextByProgress(75);

      expect(text50).toBe("Продолжить");
      expect(text75).toBe("Продолжить");
    });

    it("должен возвращать 'Начать заново' при прогрессе 100", () => {
      const { result } = renderHook(() => useCourseProgress());
      const text = result.current.getButtonTextByProgress(100);
      expect(text).toBe("Начать заново");
    });
  });

  describe("getCourseButtonInfo", () => {
    it("должен возвращать информацию о курсе (не добавлен, прогресс 0)", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          selectedCourses: [],
          courseProgress: [],
        },
        allCourses: [],
      });

      const { result } = renderHook(() => useCourseProgress());
      const info = result.current.getCourseButtonInfo("course-123");

      expect(info).toEqual({
        progress: 0,
        isAdded: false,
        buttonText: "Начать",
      });
    });

    it("должен возвращать информацию о добавленном курсе с прогрессом", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          selectedCourses: ["course-123"],
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "w1", workoutCompleted: true },
                { workoutId: "w2", workoutCompleted: false },
              ],
            },
          ],
        },
        allCourses: [
          {
            _id: "course-123",
            workouts: ["w1", "w2"],
          },
        ],
      });

      const { result } = renderHook(() => useCourseProgress());
      const info = result.current.getCourseButtonInfo("course-123");

      expect(info.isAdded).toBe(true);
      expect(info.progress).toBe(50);
      expect(info.buttonText).toBe("Продолжить");
    });
  });

  describe("getCourseWithProgress", () => {
    it("должен возвращать курс с добавленными полями прогресса", () => {
      mockUseAppSelector.mockReturnValue({
        usersCourse: {
          courseProgress: [
            {
              courseId: "course-123",
              workoutsProgress: [
                { workoutId: "w1", workoutCompleted: true },
                { workoutId: "w2", workoutCompleted: false },
              ],
            },
          ],
        },
        allCourses: [
          {
            _id: "course-123",
            workouts: ["w1", "w2"],
          },
        ],
      });

      const mockCourse = {
        _id: "course-123",
        nameRU: "Йога",
        nameEN: "Yoga",
        description: "Описание",
        durationInDays: 30,
        difficulty: "начальный",
        dailyDurationInMinutes: { from: 15, to: 30 },
        fitting: ["Для начинающих"],
        directions: ["Хатха"],
        workouts: ["w1", "w2"],
        order: 1,
        __v: 0,
      };

      const { result } = renderHook(() => useCourseProgress());
      const courseWithProgress =
        result.current.getCourseWithProgress(mockCourse);

      expect(courseWithProgress.progress).toBe(50);
      expect(courseWithProgress.buttonText).toBe("Продолжить");
      expect(courseWithProgress.nameRU).toBe("Йога");
    });
  });
});
