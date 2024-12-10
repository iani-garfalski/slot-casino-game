import WalletService from './walletService'; // Import the class itself

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService(1000); // Initialize with an initial balance
  });

  test('should initialize with correct balance', () => {
    expect(walletService.getBalance()).toEqual({ balance: 1000 });
  });

  test('should throw error if initial balance is invalid', () => {
    expect(() => new WalletService(-1000)).toThrow('Initial balance must be a non-negative number.');
    expect(() => new WalletService('invalid' as any)).toThrow('Initial balance must be a non-negative number.');
  });

  test('should deposit correctly', () => {
    walletService.modifyBalance(500);
    expect(walletService.getBalance()).toEqual({ balance: 1500 });
  });

  test('should withdraw correctly', () => {
    walletService.modifyBalance(-300);
    expect(walletService.getBalance()).toEqual({ balance: 700 });
  });

  test('should throw error on invalid deposit or withdrawal', () => {
    expect(() => walletService.modifyBalance('invalid' as any)).toThrow('Invalid amount.');
    expect(() => walletService.modifyBalance(-2000)).toThrow('Insufficient funds.');
  });

  test('should handle bets and winnings correctly', () => {
    walletService.placeBet(200); // Total Bet: 200
    walletService.recordWinnings(150); // Total Winnings: 150

    const stats = walletService.getRtpStats();
    expect(stats.totalBet).toBe(200);
    expect(stats.totalWinnings).toBe(150);
    expect(walletService.getBalance()).toEqual({ balance: 950 }); // 1000 - 200 + 150
  });

  test('should throw error on invalid bet or winnings amounts', () => {
    expect(() => walletService.placeBet(-100)).toThrow('Invalid bet amount.');
    expect(() => walletService.placeBet(2000)).toThrow('Insufficient funds for bet.');
    expect(() => walletService.recordWinnings(-50)).toThrow('Invalid winnings amount.');
  });

  test('should calculate RTP correctly', () => {
    walletService.placeBet(100); // Total Bet: 100
    walletService.recordWinnings(50); // Total Winnings: 50

    const stats = walletService.getRtpStats();
    expect(stats.totalBet).toBe(100);
    expect(stats.totalWinnings).toBe(50);

    const rtp = (stats.totalWinnings / stats.totalBet) * 100;
    expect(rtp).toBe(50);
  });

  test('should return RTP stats even if no bets or winnings have occurred', () => {
    const stats = walletService.getRtpStats();
    expect(stats.totalBet).toBe(0);
    expect(stats.totalWinnings).toBe(0);
  });
});
