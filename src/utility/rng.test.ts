import { getRandomInt } from './rng';

describe('getRandomInt', () => {
  test('should return a number less than the specified max value', () => {
    const max = 5;
    const result = getRandomInt(max);
    expect(result).toBeGreaterThanOrEqual(0); // Should return at least 0
    expect(result).toBeLessThan(max); // Should be less than max
  });

  test('should return an integer', () => {
    const max = 10;
    const result = getRandomInt(max);
    expect(Number.isInteger(result)).toBe(true); // Should be an integer
  });
});
