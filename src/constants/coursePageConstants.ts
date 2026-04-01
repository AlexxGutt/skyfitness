export const coursePageImagePositions: Record<
  string,
  { top: number; right: number; width: number; height: number; bgColor: string }
> = {
  Yoga: {
    top: -231,
    right: -231,
    width: 1023,
    height: 683,
    bgColor: "#FFC700",
  },
  Fitness: {
    top: -32,
    right: -320,
    width: 1150,
    height: 767,
    bgColor: "#F7A012",
  },
  Stretching: {
    top: 0,
    right: 0,
    width: 360,
    height: 540,
    bgColor: "#2491D2",
  },
  StepAirobic: {
    top: -715,
    right: 30,
    width: 521,
    height: 1081,
    bgColor: "#FF7E65",
  },
  BodyFlex: {
    top: -168,
    right: -111,
    width: 779,
    height: 520,
    bgColor: "#7D458C",
  },
};

export const coursePageImagePositionsMobile: Record<
  string,
  { top: number; right: number; width: number; height: number; bgColor: string }
> = {
  Yoga: {
    top: -200,
    right: -180,
    width: 800,
    height: 683,
    bgColor: "#FFC700",
  },
  Fitness: {
    top: -32,
    right: -360,
    width: 1150,
    height: 767,
    bgColor: "#F7A012",
  },
  Stretching: {
    top: 0,
    right: 40,
    width: 360,
    height: 540,
    bgColor: "#2491D2",
  },
  StepAirobic: {
    top: -715,
    right: -40,
    width: 521,
    height: 1081,
    bgColor: "#FF7E65",
  },
  BodyFlex: {
    top: -168,
    right: -150,
    width: 779,
    height: 520,
    bgColor: "#7D458C",
  },
};

export const getCoursePageImagePosition = (
  nameEN: string,
  isMobile: boolean = false,
) => {
  if (isMobile) {
    return (
      coursePageImagePositionsMobile[nameEN] || {
        top: -231,
        right: -231,
        width: 1023,
        height: 683,
        bgColor: "#FFC700",
      }
    );
  }
  return (
    coursePageImagePositions[nameEN] || {
      top: -231,
      right: -231,
      width: 1023,
      height: 683,
      bgColor: "#FFC700",
    }
  );
};

export const getHeroImageStyle = (
  nameEN: string,
  isMobile: boolean = false,
) => {
  const position = getCoursePageImagePosition(nameEN, isMobile);
  return {
    top: position.top,
    right: position.right,
    width: position.width,
    height: position.height,
    bgColor: position.bgColor,
  };
};
