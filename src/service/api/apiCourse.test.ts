import axios from "axios";
import {
  getAllCours,
  getAddCourse,
  getUsersCourse,
  getDeleteCourse,
  deleteProgressCourse,
} from "./apiCourse";
import { BASE_URL } from "./constants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Course API", () => {
  const mockToken = "test-token-123";
  const mockCourseId = "course-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCours", () => {
    it("should fetch all courses successfully", async () => {
      const mockCourses = [
        { _id: "1", name: "Yoga" },
        { _id: "2", name: "Fitness" },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockCourses });

      const result = await getAllCours();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/courses`,
      );
      expect(result).toEqual(mockCourses);
    });

    it("should handle network error", async () => {
      const networkError = new Error("Network Error");
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(getAllCours()).rejects.toThrow("Network Error");
    });
  });

  describe("getAddCourse", () => {
    it("should add course successfully", async () => {
      const mockResponse = { data: { message: "Course added" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await getAddCourse(mockToken, mockCourseId);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/users/me/courses`,
        { courseId: mockCourseId },
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle unauthorized error", async () => {
      const authError = new Error("Unauthorized");
      mockedAxios.post.mockRejectedValueOnce(authError);

      await expect(getAddCourse(mockToken, mockCourseId)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("getUsersCourse", () => {
    it("should fetch user courses successfully", async () => {
      const mockUserData = {
        data: {
          user: {
            _id: "user-1",
            email: "test@example.com",
            selectedCourses: ["course-1", "course-2"],
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockUserData);

      const result = await getUsersCourse(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/users/me`,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockUserData);
    });

    it("should handle invalid token", async () => {
      const invalidTokenError = new Error("Invalid token");
      mockedAxios.get.mockRejectedValueOnce(invalidTokenError);

      await expect(getUsersCourse("invalid-token")).rejects.toThrow(
        "Invalid token",
      );
    });
  });

  describe("getDeleteCourse", () => {
    it("should delete course successfully", async () => {
      const mockResponse = { data: { message: "Course deleted" } };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await getDeleteCourse(mockToken, mockCourseId);

      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/users/me/courses/${mockCourseId}`,
        {
          headers: {
            "Content-Type": "",
            "Authorization": `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle course not found", async () => {
      const notFoundError = new Error("Course not found");
      mockedAxios.delete.mockRejectedValueOnce(notFoundError);

      await expect(getDeleteCourse(mockToken, "invalid-id")).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("deleteProgressCourse", () => {
    it("should reset course progress successfully", async () => {
      const mockResponse = { data: { message: "Progress reset" } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await deleteProgressCourse(mockToken, mockCourseId);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${BASE_URL}/api/fitness/courses/${mockCourseId}/reset`,
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

    it("should handle course not found when resetting progress", async () => {
      const notFoundError = new Error("Course not found");
      mockedAxios.patch.mockRejectedValueOnce(notFoundError);

      await expect(
        deleteProgressCourse(mockToken, "invalid-id"),
      ).rejects.toThrow("Course not found");
    });
  });
});
