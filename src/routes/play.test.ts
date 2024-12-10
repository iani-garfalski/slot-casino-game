import request from 'supertest';
import express from 'express';
import playRouter from './play';
import { walletService } from '../services/walletService';
import { generateMatrix, calculateWinnings } from '../utility/slot';

// Mock walletService and utility functions
jest.mock('../services/walletService', () => ({
  walletService: {
    placeBet: jest.fn(),
    recordWinnings: jest.fn(),
    getBalance: jest.fn(),
  },
}));

jest.mock('../utility/slot', () => ({
  generateMatrix: jest.fn(),
  calculateWinnings: jest.fn(),
  generateVisualMatrix: jest.fn(),
}));

describe('Play Route Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/play', playRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return 200 with matrix and winnings for a valid bet', async () => {
    const bet = 100;
    const mockBalance = { balance: 500 };
    const mockMatrix = [
      ['🍒', '🍋', '🍉'],
      ['🍋', '🍋', '🍋'],
      ['🍇', '🍇', '🍇'],
    ];
    const mockWinnings = 200;

    // Mock walletService and utility functions
    (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
    (walletService.placeBet as jest.Mock).mockResolvedValue(undefined);
    (generateMatrix as jest.Mock).mockReturnValue(mockMatrix);
    (calculateWinnings as jest.Mock).mockReturnValue(mockWinnings);
    (walletService.recordWinnings as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/play')
      .send({ bet });

    expect(response.status).toBe(200);
    expect(response.body.matrix).toEqual(mockMatrix);
    expect(response.body.winnings).toBe(mockWinnings);
    expect(walletService.placeBet).toHaveBeenCalledWith(bet);
    expect(walletService.recordWinnings).toHaveBeenCalledWith(mockWinnings);
  });

  it('should return 400 for an invalid bet amount', async () => {
    const response = await request(app)
      .post('/play')
      .send({ bet: -50 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid bet amount.');
  });

  it('should return 400 for insufficient balance', async () => {
    const bet = 200;
    const mockBalance = { balance: 100 };

    // Mock walletService
    (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);

    const response = await request(app)
      .post('/play')
      .send({ bet });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Insufficient balance.');
    expect(walletService.placeBet).not.toHaveBeenCalled();
  });

  it('should return 500 if there is an internal server error in placeBet', async () => {
    const bet = 100;
    const mockBalance = { balance: 500 };

    // Mock walletService
    (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
    (walletService.placeBet as jest.Mock).mockImplementation(() => {
      throw new Error('Place bet failed');
    });

    const response = await request(app)
      .post('/play')
      .send({ bet });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Place bet failed');
  });

  it('should return 500 if there is an internal server error in recordWinnings', async () => {
    const bet = 100;
    const mockBalance = { balance: 500 };
    const mockMatrix = [
      ['🍒', '🍋', '🍉'],
      ['🍋', '🍋', '🍋'],
      ['🍇', '🍇', '🍇'],
    ];
    const mockWinnings = 200;

    // Mock walletService and utility functions
    (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
    (walletService.placeBet as jest.Mock).mockResolvedValue(undefined);
    (generateMatrix as jest.Mock).mockReturnValue(mockMatrix);
    (calculateWinnings as jest.Mock).mockReturnValue(mockWinnings);
    (walletService.recordWinnings as jest.Mock).mockImplementation(() => {
      throw new Error('Record winnings failed');
    });

    const response = await request(app)
      .post('/play')
      .send({ bet });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Record winnings failed');
  });
});
