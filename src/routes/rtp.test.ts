import express from 'express';
import request from 'supertest';
import rtpRouter from './rtp';
import { walletService } from '../services/walletService';

// Mock walletService
jest.mock('../services/walletService', () => ({
  walletService: {
    getRtpStats: jest.fn(),
  },
}));

describe('RTP Routes', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/rtp', rtpRouter); // Assuming your route is under /rtp
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /rtp', () => {
    test('should return RTP of 0 when totalBet is 0', async () => {
      const mockStats = { totalBet: 0, totalWinnings: 0 };
      (walletService.getRtpStats as jest.Mock).mockReturnValue(mockStats);

      const response = await request(app).get('/rtp');

      // Check that the response status is 200 and the RTP is 0
      expect(response.status).toBe(200);
      expect(response.body.rtp).toBe(0);
    });

    test('should return calculated RTP when totalBet is greater than 0', async () => {
      const mockStats = { totalBet: 1000, totalWinnings: 800 };
      (walletService.getRtpStats as jest.Mock).mockReturnValue(mockStats);

      const response = await request(app).get('/rtp');

      // Calculate the expected RTP: (totalWinnings / totalBet) * 100
      const expectedRtp = parseFloat(((800 / 1000) * 100).toFixed(2));

      // Check that the response status is 200 and the RTP is correctly calculated
      expect(response.status).toBe(200);
      expect(response.body.rtp).toBe(expectedRtp);
    });

    test('should return 500 when there is an error in walletService', async () => {
      // Simulate an error in the walletService
      (walletService.getRtpStats as jest.Mock).mockImplementation(() => {
        throw new Error('Service error');
      });

      const response = await request(app).get('/rtp');

      // Check that the response status is 500 and the error message is returned
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });
  });
});
