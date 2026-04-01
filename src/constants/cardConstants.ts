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
  {
    top: number;
    left?: number;
    width?: number;
    objectFit?: string;
    objectPosition?: string;
  }
> = {
  BodyFlex: {
    top: -168,
    left: -229,
    width: 771,
  },
  StepAirobic: {
    top: -715,
    left: -89,
    width: 521,
    objectFit: "cover",
    objectPosition: "center",
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
    objectFit: "cover",
    objectPosition: "center",
  },
  Fitness: {
    top: -32,
    left: -392,
    width: 1150,
  },
};

export const courseImagePositionsMobile: Record<
  string,
  {
    top: number;
    left?: number;
    width?: number;
    objectFit?: string;
    objectPosition?: string;
  }
> = {
  BodyFlex: {
    top: -168,
    left: -229,
    width: 771,
  },
  StepAirobic: {
    top: -715,
    left: -89,
    width: 538,
    objectFit: "cover",
    objectPosition: "center",
  },
  Yoga: {
    top: -119,
    left: -242,
    width: 834,
  },
  Stretching: {
    top: 0,
    left: 0,
    width: 460,
    objectFit: "cover",
    objectPosition: "center",
  },
  Fitness: {
    top: -32,
    left: -392,
    width: 1150,
  },
};

export const getCourseImagePosition = (
  nameEN: string,
  isMobile: boolean = false,
) => {
  if (isMobile) {
    return (
      courseImagePositionsMobile[nameEN] || {
        top: 0,
        left: 0,
      }
    );
  }
  return courseImagePositions[nameEN] || { top: 0, left: 0 };
};

export const getImageStyle = (nameEN: string, isMobile: boolean = false) => {
  const position = getCourseImagePosition(nameEN, isMobile);
  return {
    top: `${position.top}px`,
    left: `${position.left || 0}px`,
    width: position.width ? `${position.width}px` : "auto",
  };
};
