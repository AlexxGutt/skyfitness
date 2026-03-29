export const parseWorkoutName = (fullName: string) => {
  // Если есть разделитель "/"
  if (fullName.includes("/")) {
    const parts = fullName.split("/").map((part) => part.trim());
    const name = parts[0] || fullName;
    const description = parts.slice(1).join(" / ") || "";
    return { name, description };
  }

  // Если нет разделителя, возвращаем полное название как name, description пустой
  return { name: fullName, description: "" };
};
