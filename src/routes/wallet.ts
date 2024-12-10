import { Router, Request, Response } from 'express';
import { walletService } from '../services/walletService';
import { WalletRequestBody, WalletResponse, ErrorResponse } from '../types';

const walletRouter = Router();

// POST /deposit route
walletRouter.post('/deposit', (req: Request<{}, {}, WalletRequestBody>, res: Response<WalletResponse | ErrorResponse>) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }
    const response: WalletResponse = walletService.modifyBalance(amount);  // Ensure the response has balance
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /withdraw route
walletRouter.post('/withdraw', (req: Request<{}, {}, WalletRequestBody>, res: Response<WalletResponse | ErrorResponse>) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }
    const response: WalletResponse = walletService.modifyBalance(-amount);  // Ensure the response has balance
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /balance route
walletRouter.get('/balance', (req: Request, res: Response<WalletResponse | ErrorResponse>) => {
  try {
    const response = walletService.getBalance();
    return res.status(200).json({ message: 'Balance retrieved.', ...response });
  } catch (error: any) {
    return res.status(500).json({ error: (error as Error).message }); // Use 'message' for error response
  }
});

export default walletRouter;
