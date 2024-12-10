import { Router, Response } from 'express';
import { generateMatrix, calculateWinnings, generateVisualMatrix } from '../utility/slot';
import { walletService } from '../services/walletService';
import { TypedRequestBody, SimRequestBody, SimResponse, ErrorResponse } from '../types';

const router = Router();

router.post('/', (req: TypedRequestBody<SimRequestBody>, res: Response<SimResponse | ErrorResponse>) => {
  try {
    const { count, bet } = req.body;
    const includeMatrices = req.query.includeMatrices === 'true';

    // Validate input
    if (typeof count !== 'number' || count <= 0 || typeof bet !== 'number' || bet <= 0) {
      return res.status(400).json({ error: 'Invalid input.' }); // Error response
    }

    const totalBet = count * bet;

    // Check if wallet balance is sufficient
    if (walletService.getBalance().balance < totalBet) {
      return res.status(400).json({ error: 'Insufficient balance.' }); // Error response
    }

    let totalWinnings = 0;
    const rounds: { winnings: number, visualMatrix: string }[] = [];

    for (let i = 0; i < count; i++) {
      // Place a bet for each round
      walletService.placeBet(bet);

      // Generate the matrix
      const matrix = generateMatrix();

      // Calculate winnings based on the generated matrix
      const winnings = calculateWinnings(matrix, bet);
      totalWinnings += winnings;

      // Record winnings in RTP stats if any
      if (winnings > 0) {
        walletService.recordWinnings(winnings);
      }

      // Add visual matrix to the rounds array (only if needed)
      if (includeMatrices) {
        const visualMatrix = generateVisualMatrix(matrix);
        rounds.push({ winnings, visualMatrix });
      }
    }

    const netResult = totalWinnings - totalBet;

    // Prepare response of type SimResponse
    const response: SimResponse = includeMatrices
      ? { totalWinnings, netResult, rounds }
      : { totalWinnings, netResult };

    return res.status(200).json(response); // Success response
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
