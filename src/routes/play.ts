import { Router, Response } from 'express';
import { generateMatrix, calculateWinnings, generateVisualMatrix } from '../utility/slot';
import { walletService } from '../services/walletService';
import { TypedRequestBody, PlayRequestBody, PlayResponse, ErrorResponse } from '../types';

const router = Router();

router.post('/', 
  (req: TypedRequestBody<PlayRequestBody>, res: Response<PlayResponse | ErrorResponse>) => {
    try {
      const { bet } = req.body;
      const includeMatrices = req.query.includeMatrices === 'true';  // Check the query param

      // Validate bet amount
      if (typeof bet !== 'number' || bet <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount.' });
      }

      // Check if wallet balance is sufficient
      if (walletService.getBalance().balance < bet) {
        return res.status(400).json({ error: 'Insufficient balance.' });
      }

    // Place the bet and update RTP stats
    walletService.placeBet(bet);

    // Simulate the game
    const matrix = generateMatrix();
    const winnings = calculateWinnings(matrix, bet);

    // Record winnings (if any) and update RTP stats
    if (winnings > 0) {
      walletService.recordWinnings(winnings);
    }

      // Prepare the response object
      const response: PlayResponse = { matrix, winnings };

      // If `includeMatrices` is true, add the visualMatrix to the response
      if (includeMatrices) {
        response.visualMatrix = generateVisualMatrix(matrix); // Add the visualMatrix here
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
);

export default router;
