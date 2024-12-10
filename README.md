# Slot Casino Game API

This API allows users to manage their wallet (deposit, withdraw, check balance) and simulate slot game rounds. It also calculates RTP (Return to Player) statistics for the game.

## How to Run

1. ```npm install```
2. ```npm run dev```
3. ```npx jest --verbose``` or ```npm run test```


## API Endpoints

port: 3000

### POST /wallet/deposit
Deposits an amount into the wallet.

**Request**:
{
  "amount": 100
}

**Response**:
{
  "message": "Balance updated.",
  "balance": 100
}

---

### POST /wallet/withdraw
Withdraws an amount from the wallet.

**Request**:
{
  "amount": 50
}

**Response**:
{
  "message": "Balance updated.",
  "balance": 50
}

---

### GET /wallet/balance
Gets the current wallet balance.

**Response**:
{
  "message": "Balance retrieved.",
  "balance": 50
}

---

### POST /play?includeMatrices=true
Plays a single round of the slot game and returns the matrix, winnings (includeMatrices=true can be used for a cleaner visual matrix)

**Request**:
{
  "bet": 10
}

**Response**:
{
  "matrix": [
    ["🍋", "🍋", "⭐"],
    ["🍒", "⭐", "🍉"],
    ["🍒", "⭐", "🍉"]
  ],
  "winnings": 50,
  "visualMatrix": "[🍋 🍋 ⭐][🍒 ⭐ 🍉][🍒 ⭐ 🍉]"
}

---

### POST /sim?includeMatrices=true
Simulates a round of the slot game. (includeMatrices=true can be used for a cleaner visual matrix)

**Request**:
{
  "count": 5,
  "bet": 10
}

**Response**:
{
  "totalWinnings": 50,
  "netResult": 20,
  "rounds": [
    {
      "winnings": 10,
      "visualMatrix": "[🍋 🍋 ⭐][🍒 ⭐ 🍉][🍒 ⭐ 🍉]"
    }
  ]
}

---

### GET /rtp
Gets the RTP (Return to Player) statistics.

**Response**:
{
  "rtp": 95.5
}

---

## Features

- **Wallet Management**:
  - **Deposit**: Add funds to the wallet.
  - **Withdraw**: Withdraw funds from the wallet.
  - **Balance**: Retrieve the current wallet balance.

- **Gameplay**:
  - **Play**: Play a single round of the slot machine game.
  - **Simulation Mode**: Simulate multiple rounds of the slot machine game.
  - **RTP Calculation**: Calculate and return the RTP (Return to Player) stats.

- **Error Handling**: Appropriate error responses for invalid inputs, insufficient balance, and unexpected errors.

---

## Technologies Used

- **Express.js, TypeScript, Jest**
