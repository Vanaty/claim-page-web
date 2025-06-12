import axios from 'axios';
import { User, TronAccount, LoginResponse, ClaimResult, TransferAlert, PasswordResetRequest, PasswordResetResponse, PasswordChangeRequest } from '../types';
import { parseTronAccount } from './utils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Récupéré depuis le fichier .env
  timeout: 10000,
});

// Add Bearer token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tronpick_token'); // Assuming token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tronpick_token'); // Remove token on 401 error
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const registerUser = async (username: string, email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const fetchUser = async (): Promise<User> => {
  const response = await api.get<User>('/users');
  return response.data;
}

export const fetchAccounts = async (): Promise<TronAccount[]> => {
  const response = await api.get('/tron-accounts');
  return response.data;
};

export const addAccount = async (account: Omit<TronAccount, 'id' | 'addedAt'>): Promise<TronAccount> => {
  console.log('Adding account:', account);
  const response = await api.post('/tron-accounts', account);
  return parseTronAccount(response.data);
};

export const removeAccount = async (accountId: string): Promise<void> => {
  await api.delete(`/tron-accounts/${accountId}`);
};

export const updateAccountTokens = async (accountId: string): Promise<ClaimResult> => {
  const response = await api.post(`/tron-accounts/${accountId}/claim`);
  if (response.status !== 200) {
    throw new Error('Failed to update account tokens');
  }
  return {
    success: response.data.success,
    amount: response.data.amount,
    message: response.data.message,
    nextClaimTime: response.data.nextClaimTime ? new Date(response.data.nextClaimTime + "Z") : undefined,
  };
};

export const transferTokens = async (recipientId: string, amount: number): Promise<TransferAlert> => {
  const response =  await api.post('/users/transfer-tokens', { recipientId, amount });
  return response.data;
};

export const updateAccount = async (accountId: string, accountData: Partial<TronAccount>): Promise<TronAccount> => {
  accountData.id = accountId; // Ensure the account ID is included in the data
  const response = await api.put(`/tron-accounts`, accountData);
  return parseTronAccount(response.data);
};

export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const response = await api.post('/auth/request-password-reset', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

// Admin API calls
export const fetchAllAccounts = async (): Promise<TronAccount[]> => {
  const response = await api.get('/admin/accounts');
  return response.data.map((account: any) => parseTronAccount(account));
};
