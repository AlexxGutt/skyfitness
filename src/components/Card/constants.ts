export const courseImages: Record<string, string> = {
  BodyFlex: "/BodyFlex.svg",
  StepAirobic: "/StepAirobic.svg",
  Yoga: "/Yoga.svg",
  Fitness: "/Fitness.svg",
  Stretching: "/Stretching.svg",
};

export const getCourseImage = (nameEN: string): string => {
  return courseImages[nameEN];
};

export const getDifficultyText = (difficulty: string): string => {
  switch (difficulty) {
    case "начальный":
      return "Начальная";
    case "средний":
      return "Средняя";
    case "сложный":
      return "Сложная";
    default:
      return difficulty;
  }
};
