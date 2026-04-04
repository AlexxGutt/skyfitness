import { parseWorkoutName } from "./parseWorkoutName";

describe("parseWorkoutName", () => {
  describe("when name does NOT contain slash", () => {
    it("should return name and empty description", () => {
      const result = parseWorkoutName("Morning Yoga");

      expect(result).toEqual({
        name: "Morning Yoga",
        description: "",
      });
    });

    it("should handle empty string", () => {
      const result = parseWorkoutName("");

      expect(result).toEqual({
        name: "",
        description: "",
      });
    });
  });

  describe("when name contains slash", () => {
    it("should remove author (last part after last slash)", () => {
      const result = parseWorkoutName(
        "Йога на каждый день / 1 день / автор курса",
      );

      expect(result).toEqual({
        name: "Йога на каждый день",
        description: "1 день",
      });
    });

    it("should handle multiple description parts", () => {
      const result = parseWorkoutName(
        "Йога на каждый день / 1 день / 2 день / 3 день / автор курса",
      );

      expect(result).toEqual({
        name: "Йога на каждый день",
        description: "1 день / 2 день / 3 день",
      });
    });

    it("should handle spaces around slashes", () => {
      const result = parseWorkoutName("Fitness/Strength/Cardio/Author");

      expect(result).toEqual({
        name: "Fitness",
        description: "Strength / Cardio",
      });
    });

    it("should return empty description when only name and author", () => {
      const result = parseWorkoutName("Yoga / Author");

      expect(result).toEqual({
        name: "Yoga",
        description: "",
      });
    });

    it("should handle trailing slash", () => {
      const result = parseWorkoutName("Yoga /");

      expect(result).toEqual({
        name: "Yoga",
        description: "",
      });
    });
  });
});
