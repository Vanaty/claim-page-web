export interface User {
  id: string;
  username: string;
  email: string;
  tokens: number;
  registeredAt: Date;
  role?: string; // Add role field to User type
}

export type BaseUrlOption = 
  | 'tronpick.io'
  | 'litepick.io'
  | 'dogepick.io'
  | 'bnbpick.io'
  | 'solpick.io'
  | 'polpick.io'
  | 'tonpick.game'
  | 'suipick.io'
  | 'freetron.in'
  | 'freexrp.in'
  | 'usdpick.io'
  | 'freetoncoin.in'
  | 'freesui.in'
  | 'freeshib.in'
  | 'freebnb.in';

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
  user_id?: string; // ID of the user who owns this account - for admin panel
  cookies?: string;
}

// Add new interface for account history
export interface AccountHistory {
  date: Date;
  balance: number;
  claimAmount?: number;
  action: 'claim' | 'balance_update' | 'game';
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

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface PasswordChangeRequest {
  token: string;
  newPassword: string;
}

export interface SiteKey {
  id?: string;
  site_name: string;
  site_key: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  network: string;
  rate: number; // Taux de change par rapport à USD
  icon?: string;
  fees?: number;
}

export interface WheelPrize {
  id: string;
  name: string;
  value: number;
  type: 'tokens' | 'bad_luck';
  color?: string;
}

export interface WheelData {
  prizes: WheelPrize[];
  spinsRemaining: number;
  canSpin: boolean;
}

export interface WheelSpinRequest {
  userId: string;
}

export interface WheelSpinResult {
  result: WheelPrize;
  signature: string;
  spinsRemaining: number;
}