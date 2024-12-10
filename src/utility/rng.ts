// Generates a random integer between 0 (inclusive) and the max value (exclusive)
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};
