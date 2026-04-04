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
    it("should fetch course workouts successfully", async () => {
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

    it("should handle course not found error", async () => {
      const error = new Error("Course not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getCourseWorkout(mockToken, "invalid-id")).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("getDataWorkout", () => {
    it("should fetch workout data successfully", async () => {
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

    it("should handle workout not found", async () => {
      const error = new Error("Workout not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getDataWorkout(mockToken, "invalid-id")).rejects.toThrow(
        "Workout not found",
      );
    });
  });

  describe("getProgressWorkout", () => {
    it("should fetch workout progress successfully", async () => {
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

    it("should handle no progress found", async () => {
      const error = new Error("Progress not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(
        getProgressWorkout(mockToken, mockCourseId, mockWorkoutId),
      ).rejects.toThrow("Progress not found");
    });
  });

  describe("changeProgressWorkout", () => {
    const mockProgressData = { progressData: [10, 15, 20] };

    it("should update workout progress successfully", async () => {
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

    it("should handle invalid progress data", async () => {
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
    it("should clear workout progress successfully", async () => {
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

    it("should handle workout not found when clearing progress", async () => {
      const error = new Error("Workout not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      await expect(
        clearProgressWorkout(mockToken, mockCourseId, "invalid-id"),
      ).rejects.toThrow("Workout not found");
    });
  });
});
