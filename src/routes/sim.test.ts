import express from 'express';
import request from 'supertest';
import simRouter from './sim';
import { walletService } from '../services/walletService';
import { generateMatrix, calculateWinnings } from '../utility/slot';

// Mock walletService and utility functions
jest.mock('../services/walletService', () => {
  return {
    walletService: {
      getBalance: jest.fn(),
      placeBet: jest.fn(),
      recordWinnings: jest.fn(),
    },
  };
});

jest.mock('../utility/slot', () => ({
  generateMatrix: jest.fn(),
  calculateWinnings: jest.fn(),
  generateVisualMatrix: jest.fn(),
}));

describe('Sim Routes', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/sim', simRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /sim', () => {
    test('should correctly process simulation request with valid input', async () => {
      const count = 3;
      const bet = 100;
      const totalBet = count * bet;
      const mockBalance = { balance: 1000 };
      const mockWinnings = 200; // Winnings for each round
      const mockMatrix = ['🍒', '🍒', '🍒']; // Example matrix for slot machine

      // Mock walletService methods
      (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
      (walletService.placeBet as jest.Mock).mockResolvedValue(undefined);
      (walletService.recordWinnings as jest.Mock).mockResolvedValue(undefined);
      (generateMatrix as jest.Mock).mockReturnValue(mockMatrix);
      (calculateWinnings as jest.Mock).mockReturnValue(mockWinnings);

      // Call the /sim endpoint with includeMatrices = true
      const responseTrue = await request(app)
        .post('/sim')
        .send({ count, bet })
        .query({ includeMatrices: 'true' });

      // Check that the response status is 200
      expect(responseTrue.status).toBe(200);
      expect(responseTrue.body.totalWinnings).toBe(mockWinnings * count); // Correct total winnings
      expect(responseTrue.body.netResult).toBe(mockWinnings * count - totalBet); // Correct net result
      expect(responseTrue.body.rounds).toHaveLength(count); // Include matrices in response

      // Ensure placeBet and recordWinnings were called correctly
      expect(walletService.placeBet).toHaveBeenCalledTimes(count); // Called for each round
      expect(walletService.placeBet).toHaveBeenCalledWith(bet); // Bet amount for each round
      expect(walletService.recordWinnings).toHaveBeenCalledTimes(count); // Called for each round
      expect(walletService.recordWinnings).toHaveBeenCalledWith(mockWinnings); // Winnings for each round
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/sim')
        .send({ count: -1, bet: 100 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid input.');
    });

    test('should return 400 for insufficient balance', async () => {
      const count = 3;
      const bet = 100;
      const totalBet = count * bet;
      const mockBalance = { balance: 200 };
      (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);

      const response = await request(app)
        .post('/sim')
        .send({ count, bet });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient balance.');
      expect(walletService.placeBet).not.toHaveBeenCalled();
    });

    test('should return 500 for service error during placeBet', async () => {
      const count = 3;
      const bet = 100;
      const mockBalance = { balance: 1000 };
      (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
      (walletService.placeBet as jest.Mock).mockImplementation(() => {
        throw new Error('Service error');
      });

      const response = await request(app)
        .post('/sim')
        .send({ count, bet });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });

    test('should return 500 for service error during recordWinnings', async () => {
      const count = 3;
      const bet = 100;
      const mockBalance = { balance: 1000 };
      const mockWinnings = 200;
      (walletService.getBalance as jest.Mock).mockReturnValue(mockBalance);
      (generateMatrix as jest.Mock).mockReturnValue(['🍒', '🍒', '🍒']);
      (calculateWinnings as jest.Mock).mockReturnValue(mockWinnings);
      (walletService.recordWinnings as jest.Mock).mockImplementation(() => {
        throw new Error('Service error');
      });

      const response = await request(app)
        .post('/sim')
        .send({ count, bet });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });
  });
});
