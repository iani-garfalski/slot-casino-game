import { getRandomInt } from "./rng";

export const SYMBOLS = ['🍒', '🍋', '🍉', '🍇', '⭐'];
export const ROWS = 3;
export const COLUMNS = 3;
const MULTIPLIER = 5; // Used for winnings multiply

// Function to generate a matrix of symbols
export const generateMatrix = (): string[][] => {
  const matrix: string[][] = [];
  for (let i = 0; i < ROWS; i++) {
    matrix.push(new Array(COLUMNS).fill(null).map(() => SYMBOLS[getRandomInt(SYMBOLS.length)]));
  }
  return matrix;
};

// New Function to return visual matrix (formatted as string)
export const generateVisualMatrix = (matrix: string[][]): string => {
  // Convert the matrix into the string format to visualize it: [🍒 🍇 🍉][🍉 🍋 ⭐][⭐ 🍋 🍒]
  return matrix.map(row => `[${row.join(' ')}]`).join('');
};

// Calculate winnings based on the matrix
export const calculateWinnings = (matrix: string[][], bet: number): number => {
  let winnings = 0;
  for (const row of matrix) {
    if (row.every((symbol) => symbol === row[0])) {
      winnings += bet * MULTIPLIER; // Payout multiplier
    }
  }
  return winnings;
};
