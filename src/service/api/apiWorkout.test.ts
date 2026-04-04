import axios from "axios";
import {
  getCourseWorkout,
  getDataWorkout,
  getProgressWorkout,
  changeProgressWorkout,
  clearProgressWorkout,
} from "./apiWorkout";
import { BASE_URL } from "./constants";

// Мокаем axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Workout API", () => {
  const mockToken = "test-token-123";
  const mockCourseId = "course-123";
  const mockWorkoutId = "workout-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCourseWorkout", () => {
    it("должен успешно получить тренировки курса", async () => {
      const mockWorkouts = {
        data: [
          { _id: "workout-1", name: "Yoga Basics" },
          { _id: "workout-2", name: "Yoga Advanced" },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce(mockWorkouts);

      const result = await getCourseWorkout(mockToken, mockCourseId);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/courses/${mockCourseId}/workouts`,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockWorkouts);
    });

    it("должен обрабатывать ошибку 'курс не найден'", async () => {
      const error = new Error("Course not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getCourseWorkout(mockToken, "invalid-id")).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("getDataWorkout", () => {
    it("должен успешно получить данные тренировки", async () => {
      const mockWorkoutData = {
        data: {
          _id: mockWorkoutId,
          name: "Morning Yoga",
          video: "https://example.com/video.mp4",
          exercises: [
            { name: "Downward Dog", quantity: 10 },
            { name: "Cobra Pose", quantity: 8 },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockWorkoutData);

      const result = await getDataWorkout(mockToken, mockWorkoutId);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/workouts/${mockWorkoutId}`,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockWorkoutData);
    });

    it("должен обрабатывать ошибку 'тренировка не найдена'", async () => {
      const error = new Error("Workout not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getDataWorkout(mockToken, "invalid-id")).rejects.toThrow(
        "Workout not found",
      );
    });
  });

  describe("getProgressWorkout", () => {
    it("должен успешно получить прогресс тренировки", async () => {
      const mockProgress = {
        data: {
          progressData: [10, 20, 15],
          workoutCompleted: false,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockProgress);

      const result = await getProgressWorkout(
        mockToken,
        mockCourseId,
        mockWorkoutId,
      );

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/users/me/progress?courseId=${mockCourseId}&workoutId=${mockWorkoutId}`,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockProgress);
    });

    it("должен обрабатывать ошибку 'прогресс не найден'", async () => {
      const error = new Error("Progress not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(
        getProgressWorkout(mockToken, mockCourseId, mockWorkoutId),
      ).rejects.toThrow("Progress not found");
    });
  });

  describe("changeProgressWorkout", () => {
    const mockProgressData = { progressData: [10, 15, 20] };

    it("должен успешно обновить прогресс тренировки", async () => {
      const mockResponse = { data: { message: "Progress updated" } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await changeProgressWorkout(
        mockToken,
        mockCourseId,
        mockWorkoutId,
        mockProgressData,
      );

      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/courses/${mockCourseId}/workouts/${mockWorkoutId}`,
        mockProgressData,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("должен обрабатывать неверные данные прогресса", async () => {
      const invalidData = { progressData: [] };
      const error = new Error("Invalid progress data");
      mockedAxios.patch.mockRejectedValueOnce(error);

      await expect(
        changeProgressWorkout(
          mockToken,
          mockCourseId,
          mockWorkoutId,
          invalidData,
        ),
      ).rejects.toThrow("Invalid progress data");
    });
  });

  describe("clearProgressWorkout", () => {
    it("должен успешно очистить прогресс тренировки", async () => {
      const mockResponse = { data: { message: "Progress cleared" } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await clearProgressWorkout(
        mockToken,
        mockCourseId,
        mockWorkoutId,
      );

      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/courses/${mockCourseId}/workouts/${mockWorkoutId}/reset`,
        null,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("должен обрабатывать ошибку 'тренировка не найдена' при очистке прогресса", async () => {
      const error = new Error("Workout not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      await expect(
        clearProgressWorkout(mockToken, mockCourseId, "invalid-id"),
      ).rejects.toThrow("Workout not found");
    });
  });
});
