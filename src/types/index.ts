export interface User {
  id: string;
  username: string;
  email: string;
  tokens: number;
  registeredAt: Date;
}

export type BaseUrlOption = 
  | 'tronpick.io'
  | 'litepick.io'
  | 'dogepick.io'
  | 'bnbpick.io'
  | 'solpick.io'
  | 'polpick.io'
  | 'tonpick.game'
  | 'suipick.io';

export interface TronAccount {
  id: string;
  address: string;
  privateKey: string;
  balance: number;
  lastClaim?: Date;
  timeZoneOffset?: number; // Offset in hours from UTC
  nextClaim?: Date;
  status: 'active' | 'pending' | 'error';
  addedAt: Date;
  baseUrl?: BaseUrlOption; // Updated to specific options
  canGame?: number; // '1' if the account can game, '0' otherwise;Utility for reaching stamina wagared
  proxy?: string; // Optional proxy for the account
}

export interface ClaimResult {
  success: boolean;
  amount?: number;
  message: string;
  nextClaimTime?: Date;
}

export interface Token {
  type_token: string;
  access_token: string;
}

export interface LoginResponse {
  user: User;
  token: Token;
}

export interface TransferAlert {
  success: boolean;
  message: string;
}