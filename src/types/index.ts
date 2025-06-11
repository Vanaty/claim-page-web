export interface User {
  id: string;
  username: string;
  email: string;
  tokens: number;
  registeredAt: Date;
}

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