import { Request } from 'express';

// Represents the request body for "play" action, containing a bet field of type number.
export interface PlayRequestBody {
  bet: number;
}

// Represents the request body for a "simulation" action, containing count and bet fields, both of type number.
export interface SimRequestBody {
  count: number;
  bet: number;
}

// Represents the response object for "play" action.
export interface PlayResponse {
  matrix: string[][]; // Example: ['🍒', '🍒', '🍒']
  winnings: number;
  visualMatrix?: string;  // Only included if `includeMatrices` is true
}

// Represents the response object for "simulation" action. 
export interface SimResponse {
  totalWinnings: number;
  netResult: number;
  rounds?: { winnings: number; visualMatrix: string }[];
}

// Represents the response object for the RTP (Return to Player) action
export interface RTPResponse {
  rtp: number;
}

// Represents the error responses
export interface ErrorResponse {
  error: string;
}

// Generic interface that extends the Request object from Express to include a strongly-typed body field.
export interface TypedRequestBody<T> extends Request {
  body: T;
}

// Represents the request body for "wallet" action, containing an amount field of type number.
export interface WalletRequestBody {
  amount: number;
}

// Represents the response object for "wallet" action.
export interface WalletResponse {
  message: string;
  balance: number;
}

// A type alias for a 2D array of strings.
export type Matrix = string[][];
