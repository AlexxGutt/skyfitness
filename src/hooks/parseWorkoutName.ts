export const parseWorkoutName = (fullName: string) => {
  if (fullName.includes("/")) {
    const parts = fullName.split("/").map((part) => part.trim());
    const name = parts[0] || fullName;
    const description = parts.slice(1, -1).join(" / ") || "";
    return { name, description };
  }

  return { name: fullName, description: "" };
};
