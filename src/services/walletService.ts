export default class WalletService {
  private balance: number;
  private totalBet: number; // Tracks total amount bet for games
  private totalWinnings: number; // Tracks total winnings from games

  constructor(initialBalance: number) {
    if (typeof initialBalance !== 'number' || initialBalance < 0) {
      throw new Error('Initial balance must be a non-negative number.');
    }
    this.balance = initialBalance;
    this.totalBet = 0;
    this.totalWinnings = 0;
  }

  // Function to get the current balance
  getBalance(): { balance: number } {
    return { balance: this.balance };
  }

  // Function to add or remove funds (account-level operations)
  modifyBalance(amount: number): { message: string; balance: number } {
    if (typeof amount !== 'number') {
      throw new Error('Invalid amount.');
    }
    this.balance += amount;
    if (this.balance < 0) throw new Error('Insufficient funds.');
    return { message: 'Balance updated.', balance: this.balance };
  }

  // Function to handle betting (game-specific operation)
  placeBet(amount: number): void {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid bet amount.');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds for bet.');
    }
    this.balance -= amount;
    this.totalBet += amount;
  }

  // Function to handle winnings (game-specific operation)
  recordWinnings(amount: number): void {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid winnings amount.');
    }
    this.balance += amount;
    this.totalWinnings += amount;
  }

  // Get RTP-related stats
  getRtpStats(): { totalBet: number; totalWinnings: number } {
    return {
      totalBet: this.totalBet,
      totalWinnings: this.totalWinnings,
    };
  }
}

// Export a singleton instance of WalletService
export const walletService = new WalletService(1000); // Initial balance of 1000
