import { generateMatrix, calculateWinnings, generateVisualMatrix, SYMBOLS, ROWS, COLUMNS } from './slot';
import { getRandomInt } from './rng';

// Mock the getRandomInt function to avoid randomness in tests
jest.mock('../utility/rng', () => ({
  getRandomInt: jest.fn(),
}));

describe('slot.ts', () => {
  beforeEach(() => {
    // Reset the mock function before each test
    (getRandomInt as jest.Mock).mockReset();
  });

  describe('generateMatrix', () => {
    test('should generate a matrix with correct number of rows and columns', () => {
      // Mock the random number generation for a controlled output
      (getRandomInt as jest.Mock).mockReturnValue(0); // Always return the first symbol (🍒)
      
      const matrix = generateMatrix();
      expect(matrix).toHaveLength(ROWS); // Should have 3 rows
      matrix.forEach(row => {
        expect(row).toHaveLength(COLUMNS); // Should have 3 columns
      });
    });

    test('should generate a matrix with symbols', () => {
      (getRandomInt as jest.Mock).mockReturnValue(0); // Always return the first symbol (🍒)
      
      const matrix = generateMatrix();
      matrix.forEach(row => {
        row.forEach(symbol => {
          expect(SYMBOLS).toContain(symbol); // Should only contain symbols from the SYMBOLS array
        });
      });
    });
  });

  describe('calculateWinnings', () => {
    test('should calculate winnings correctly when all symbols in a row match', () => {
      const matrix = [
        ['🍒', '🍒', '🍒'],
        ['🍋', '🍋', '🍋'],
        ['🍇', '🍇', '🍇'],
      ];
      const bet = 100;
      const winnings = calculateWinnings(matrix, bet);
      expect(winnings).toBe(1500); // 3 rows matching, each row wins 100 * 5
    });

    test('should return 0 when no symbols in a row match', () => {
      const matrix = [
        ['🍒', '🍋', '🍉'],
        ['🍇', '⭐', '🍋'],
        ['🍉', '🍇', '🍋'],
      ];
      const bet = 100;
      const winnings = calculateWinnings(matrix, bet);
      expect(winnings).toBe(0); // No rows match, so no winnings
    });

    test('should return correct winnings when only some rows match', () => {
      const matrix = [
        ['🍒', '🍒', '🍒'],
        ['🍋', '🍋', '🍋'],
        ['🍉', '🍇', '🍋'],
      ];
      const bet = 50;
      const winnings = calculateWinnings(matrix, bet);
      expect(winnings).toBe(500); // First two rows match, 50 * 5 * 2 = 500 + 500 = 1000
    });
  });

  describe('generateVisualMatrix', () => {
    test('should generate a visual matrix in the correct string format', () => {
      const matrix = [
        ['🍒', '🍇', '🍉'],
        ['🍉', '🍋', '⭐'],
        ['⭐', '🍋', '🍒'],
      ];
      const visualMatrix = generateVisualMatrix(matrix);
      expect(visualMatrix).toBe('[🍒 🍇 🍉][🍉 🍋 ⭐][⭐ 🍋 🍒]'); // Check visual matrix string format
    });
  });
});
