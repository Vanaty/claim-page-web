import axios from 'axios';
import { User, TronAccount,AccountHistory, LoginResponse, ClaimResult, TransferAlert, PasswordResetResponse, SiteKey, SupportedCurrency, WheelData, WheelSpinResult, Token, Job, RouletteConfig, RouletteSession } from '../types';
import { parseTronAccount } from './utils';

const api = axios.create({
  baseURL: '/api', // Récupéré depuis le fichier .env
  timeout: 50000,
});

// Add Bearer token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tronpick_token'); // Assuming token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variable to track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Handle 401 errors with token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('tronpick_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/api/auth/refresh-token', {
          token: refreshToken
        });

        const tokenData: Token = response.data;
        localStorage.setItem('tronpick_token', tokenData.access_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + tokenData.access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + tokenData.access_token;

        processQueue(null, tokenData.access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        
        // If refresh fails, logout
        localStorage.removeItem('tronpick_token');
        localStorage.removeItem('tronpick_refresh_token');
        window.location.reload();
        
        return Promise.reject(err);
      }
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

export const checkEmailAvailability = async (email: string): Promise<{ available: boolean; message?: string }> => {
  const response = await api.post('/auth/check-email', { email });
  return response.data;
};

export const checkUsernameAvailability = async (username: string): Promise<{ available: boolean; message?: string }> => {
  const response = await api.post('/auth/check-username', { username });
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

export const addAccount = async (account: Omit<TronAccount, 'id' | 'addedAt'>): Promise<Job> => {
  console.log('Adding account:', account);
  const response = await api.post('/tron-accounts', account, { timeout: 120000 });
  return response.data;
};

export const checkJobStatus = async (jobId: string): Promise<Job> => {
  const response = await api.get(`/tron-accounts/jobs/${jobId}`);
  return response.data;
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
  const response = await api.put(`/tron-accounts/${accountId}`, accountData);
  return parseTronAccount(response.data);
};

export const fetchAccountHistory = async (accountId: string): Promise<AccountHistory[]> => {
  const response = await api.get(`/tron-accounts/${accountId}/history`);
  return response.data.map((entry: any) => ({
    ...entry,
    date: new Date(entry.date + "Z")
  }));
};

export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const response = await api.post('/auth/request-password-reset', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<PasswordResetResponse> => {
  const response = await api.post('/users/change-password', { currentPassword, newPassword });
  return response.data;
};

// Admin API calls
export const fetchAllAccounts = async (): Promise<TronAccount[]> => {
  const response = await api.get('/admin/accounts');
  return response.data.map((account: any) => parseTronAccount(account));
};

// SiteKey API calls
export const fetchSiteKeys = async (): Promise<SiteKey[]> => {
  const response = await api.get('/admin/sitekeys');
  return response.data;
};

export const createSiteKey = async (siteKey: Omit<SiteKey, 'id' | 'created_at' | 'updated_at'>): Promise<SiteKey> => {
  const response = await api.post('/admin/sitekey', siteKey);
  return response.data;
};

export const updateSiteKey = async (id: string, siteKey: Partial<SiteKey>): Promise<SiteKey> => {
  siteKey.id = id; // Ensure the ID is included in the data
  const response = await api.post(`/admin/sitekey`, siteKey);
  return response.data;
};

export const deleteSiteKey = async (site_name: string): Promise<void> => {
  await api.delete(`/admin/sitekey/${site_name}`);
};

export const createPayment = async (tokenPackageId: string, coin: string): Promise<any> => {
  const response = await api.post('/payments/create', { 
    'package_id': tokenPackageId,
    'currency': coin
  });
  return response.data;
};

export const getTokenPackages = async (): Promise<any[]> => {
  const response = await api.get('payments/packages');
  return response.data;
};

export const checkPaymentStatus = async (orderId: string, txId: string): Promise<any> => {
  const response = await api.put(`/payments/verify/${orderId}`, {
    'txId': txId,
    'payment_id': orderId
  });
  return response.data;
};

export const checkPaymentStatusById = async (paymentId: string): Promise<any> => {
  const response = await api.get(`/payments/status/${paymentId}`);
  return response.data;
}

export const getUserPaymentHistory = async (): Promise<any[]> => {
  const response = await api.get('/payments/history');
  return response.data;
}

export const getSupportedCurrencies = async (): Promise<SupportedCurrency[]> => {
  const response = await api.get('/payments/currencies');
  return response.data;
}

export const getTrasactionHistory = async (): Promise<any[]> => {
  const response = await api.get(`/users/transactions`);
  return response.data;
}

// Announcement API calls
export const getAnnouncements = async (): Promise<any[]> => {
  const response = await api.get('/announcements');
  return response.data;
};

export const createAnnouncement = async (announcement: {
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isActive: boolean;
}): Promise<any> => {
  const response = await api.post('/announcements', announcement);
  return response.data;
};

export const updateAnnouncement = async (id: string, announcement: any): Promise<any> => {
  const response = await api.put(`/announcements/${id}`, announcement);
  return response.data;
};

export const deleteAnnouncement = async (id: string): Promise<any> => {
  return await api.delete(`/announcements/${id}`);
};

// Wheel of Fortune API functions
export const fetchWheelData = async (): Promise<WheelData> => {
  const response = await api.get('/wheel/data');
  return response.data;
};

export const spinWheel = async (userId: string): Promise<WheelSpinResult> => {
  const response = await api.post('/wheel/spin', { userId });
  return response.data;
};

// ─── Roulette Bot ────────────────────────────────────────────────────────────

export const startRouletteBot = async (config: RouletteConfig): Promise<{ session_ids: string[]; message: string }> => {
  const response = await api.post('/roulette/start', config);
  return response.data;
};

export const stopRouletteBot = async (sessionId: string): Promise<{ message: string }> => {
  const response = await api.post(`/roulette/stop/${sessionId}`);
  return response.data;
};

export const stopAllRouletteBots = async (): Promise<{ message: string }> => {
  const response = await api.post('/roulette/stop-all');
  return response.data;
};

export const getRouletteStatus = async (): Promise<RouletteSession[]> => {
  const response = await api.get('/roulette/status');
  return response.data;
};