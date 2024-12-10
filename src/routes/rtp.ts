import { Router, Request, Response } from 'express';
import { walletService } from '../services/walletService';
import { ErrorResponse, RTPResponse } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response<RTPResponse | ErrorResponse>) => {
  try {
    const { totalBet, totalWinnings } = walletService.getRtpStats();
    
    if (totalBet === 0) {
      return res.status(200).json({ rtp: 0 });
    }

    // Calculate RTP as a percentage (totalWinnings / totalBet * 100)
    const rtp = (totalWinnings / totalBet) * 100;

    // Round to two decimal places
    const formattedRtp = parseFloat(rtp.toFixed(2));

    // Return the RTP percentage
    return res.status(200).json({ rtp: formattedRtp });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
