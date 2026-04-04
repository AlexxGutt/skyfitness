import axios from "axios";
import { getSignUp, getSignIn } from "./apiAuth";
import { BASE_URL, SIGNIN_URL, SIGNUP_URL } from "./constants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserData = {
    email: "test@example.com",
    password: "password123",
  };

  describe("getSignUp", () => {
    it("should send POST request to signup endpoint with correct data", async () => {
      const mockResponse = { data: { message: "User created" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await getSignUp(mockUserData);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}${SIGNUP_URL}`,
        mockUserData,
        { headers: { "Content-Type": "" } },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle registration error", async () => {
      const mockError = new Error("Registration failed");
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(getSignUp(mockUserData)).rejects.toThrow(
        "Registration failed",
      );
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should handle network error", async () => {
      const networkError = new Error("Network Error");
      mockedAxios.post.mockRejectedValueOnce(networkError);

      await expect(getSignUp(mockUserData)).rejects.toThrow("Network Error");
    });
  });

  describe("getSignIn", () => {
    it("should send POST request to signin endpoint with correct data", async () => {
      const mockResponse = { data: { token: "jwt-token-123" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await getSignIn(mockUserData);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}${SIGNIN_URL}`,
        mockUserData,
        { headers: { "Content-Type": "" } },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle invalid credentials", async () => {
      const mockError = new Error("Invalid email or password");
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(getSignIn(mockUserData)).rejects.toThrow(
        "Invalid email or password",
      );
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should handle missing user error", async () => {
      const mockError = new Error("User not found");
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(getSignIn(mockUserData)).rejects.toThrow("User not found");
    });
  });
});
