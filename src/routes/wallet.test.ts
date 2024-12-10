import express from 'express';
import request from 'supertest';
import walletRouter from './wallet';
import { walletService } from '../services/walletService';

// Mock walletService
jest.mock('../services/walletService', () => {
  return {
    walletService: {
      modifyBalance: jest.fn(),
      getBalance: jest.fn(),
    },
  };
});

describe('Wallet Routes', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/wallet', walletRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /wallet/deposit', () => {
    test('should correctly process deposit request', async () => {
      const depositAmount = 500;
      const mockResponse = { message: 'Balance updated.', balance: 1500 };
      (walletService.modifyBalance as jest.Mock).mockReturnValue(mockResponse);

      const response = await request(app)
        .post('/wallet/deposit')
        .send({ amount: depositAmount });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Balance updated.');
      expect(response.body.balance).toBe(1500);
    });

    test('should return 400 for invalid deposit amount', async () => {
      const response = await request(app)
        .post('/wallet/deposit')
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid amount.');
    });

    test('should return 400 for error in modifyBalance service', async () => {
      const depositAmount = 500;
      const errorMessage = 'Service error';
      (walletService.modifyBalance as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const response = await request(app)
        .post('/wallet/deposit')
        .send({ amount: depositAmount });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(errorMessage);
    });
  });

  describe('POST /wallet/withdraw', () => {
    test('should correctly process withdrawal request', async () => {
      const withdrawAmount = 300;
      const mockResponse = { message: 'Balance updated.', balance: 700 };
      (walletService.modifyBalance as jest.Mock).mockReturnValue(mockResponse);

      const response = await request(app)
        .post('/wallet/withdraw')
        .send({ amount: withdrawAmount });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Balance updated.');
      expect(response.body.balance).toBe(700);
    });

    test('should return 400 for invalid withdrawal amount', async () => {
      const response = await request(app)
        .post('/wallet/withdraw')
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid amount.');
    });

    test('should return 400 for error in modifyBalance service', async () => {
      const withdrawAmount = 300;
      const errorMessage = 'Service error';
      (walletService.modifyBalance as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const response = await request(app)
        .post('/wallet/withdraw')
        .send({ amount: withdrawAmount });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(errorMessage);
    });
  });

  describe('GET /wallet/balance', () => {
    test('should correctly retrieve balance', async () => {
      const mockBalance = { balance: 1000 };
      (walletService.getBalance as jest.Mock).mockReturnValueOnce(mockBalance);

      const response = await request(app).get('/wallet/balance');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Balance retrieved.');
      expect(response.body.balance).toBe(1000);
    });

    test('should return 500 for error in getBalance service', async () => {
      const errorMessage = 'Service error';
      (walletService.getBalance as jest.Mock).mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
    
      const response = await request(app).get('/wallet/balance');
    
      expect(response.status).toBe(500);
      expect(response.body.error).toBe(errorMessage);
    });    
  });
});
