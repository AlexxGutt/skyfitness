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

export const courseImagePositions: Record<
  string,
  { top: number; left?: number; width?: number }
> = {
  BodyFlex: {
    top: -168,
    left: -229,
    width: 771,
  },
  StepAirobic: {
    top: -715,
    left: -279,
    width: 721,
  },
  Yoga: {
    top: -119,
    left: -242,
    width: 834,
  },
  Stretching: {
    top: 0,
    left: 0,
    width: 360,
  },
  Fitness: {
    top: -32,
    left: -392,
    width: 1150,
  },
};
export const getCourseImagePosition = (nameEN: string) => {
  return courseImagePositions[nameEN] || { top: 0, left: 0 };
};

export const getImageStyle = (nameEN: string) => {
  const position = getCourseImagePosition(nameEN);
  return {
    top: `${position.top}px`,
    left: `${position.left || 0}px`,
    width: position.width ? `${position.width}px` : "auto",
  };
};
