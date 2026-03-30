export const useParseExerciseName = () => {
  const parseExerciseName = (fullName: string): string => {
    return fullName.split("(")[0].trim();
  };

  return { parseExerciseName };
};
