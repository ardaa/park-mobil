import apiClient from './api-client';

// Types
export interface ParkingSession {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  last4: string;
  expiryDate: string;
  brand: string;
}

export interface ParkingHistory {
  id: string;
  date: string;
  location: string;
  duration: string;
  cost: number;
  status: 'completed' | 'ongoing';
}

export interface FavoriteLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'parking';
  amount: number;
  date: string;
  status?: 'completed' | 'pending' | 'failed';
  location?: string;
}

export interface WalletInfo {
  balance: number;
  autoTopup: {
    enabled: boolean;
    threshold: number;
    amount: number;
  };
}

// Add this interface for card details
export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const mockParkingHistory: ParkingHistory[] = [
  {
    id: '1',
    date: '2024-03-15',
    location: 'Taksim Meydanı Otoparkı',
    duration: '2s 30dk',
    cost: 125.50,
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-03-14',
    location: 'Kadıköy İskele Otoparkı',
    duration: '1s 45dk',
    cost: 87.75,
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-03-14',
    location: 'Forum İstanbul AVM',
    duration: '3s',
    cost: 150.00,
    status: 'completed'
  }
];

// API Routes and functions
export const apiServices = {
  // GET /parking/active
  getActiveParkingSessions: async (): Promise<ParkingSession[]> => {
    // const response = await apiClient.get('/parking/active');
    // return response.data;
    
    // Mock data until API is implemented
    return [
      {
        id: '1',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        location: 'Central Park',
        cost: 10.50,
        status: 'active',
      }
    ];
  },

  // GET /payment/methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    // const response = await apiClient.get('/payment/methods');
    // return response.data;
    
    return [
      {
        id: '1',
        type: 'credit',
        last4: '4242',
        expiryDate: '12/24',
        brand: 'Visa',
      }
    ];
  },

  // POST /payment/methods
  addPaymentMethod: async (cardDetails: CardDetails): Promise<PaymentMethod> => {
    // const response = await apiClient.post('/payment/methods', cardDetails);
    // return response.data;
    
    if (!cardDetails.cardNumber) {
      throw new Error('Card number is required');
    }
    
    return {
      id: Date.now().toString(),
      type: 'credit',
      last4: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
      expiryDate: cardDetails.expiryDate,
      brand: 'Visa',
    };
  },

  // GET /parking/history
  getParkingHistory: async (): Promise<ParkingHistory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockParkingHistory;
  },

  // GET /favorites
  getFavoriteLocations: async (): Promise<FavoriteLocation[]> => {
    // const response = await apiClient.get('/favorites');
    // return response.data;
    
    return [
      {
        id: '1',
        name: 'Office',
        address: '123 Business St',
        coordinates: {
          latitude: 41.0082,
          longitude: 28.9784,
        },
      }
    ];
  },

  // GET /wallet/info
  getWalletInfo: async (): Promise<WalletInfo> => {
    // const response = await apiClient.get('/wallet/info');
    // return response.data;
    
    return {
      balance: 1225.00,
      autoTopup: {
        enabled: true,
        threshold: 50,
        amount: 100
      }
    };
  },

  // GET /wallet/transactions
  getWalletTransactions: async (): Promise<WalletTransaction[]> => {
    // const response = await apiClient.get('/wallet/transactions');
    // return response.data;
    
    return [
      {
        id: '1',
        type: 'topup',
        amount: 100,
        date: '2024-02-15',
        status: 'completed'
      },
      {
        id: '2',
        type: 'parking',
        amount: -25,
        date: '2024-02-14',
        location: 'Central Station Parking'
      },
      {
        id: '3',
        type: 'topup',
        amount: 50,
        date: '2024-02-10',
        status: 'completed'
      }
    ];
  },

  // POST /wallet/topup
  topupWallet: async (amount: number): Promise<WalletTransaction> => {
    // const response = await apiClient.post('/wallet/topup', { amount });
    // return response.data;
    
    return {
      id: Date.now().toString(),
      type: 'topup',
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed'
    };
  },

  // PUT /wallet/auto-topup
  updateAutoTopup: async (settings: { enabled: boolean; threshold: number; amount: number }): Promise<void> => {
    // await apiClient.put('/wallet/auto-topup', settings);
    return;
  }
}; 