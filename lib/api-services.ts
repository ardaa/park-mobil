import apiClient from './api-client';
import { Campaign } from "@/types/campaign";

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
  location: string;
  date: string;
  status?: string;
  amount?: number;
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

// Add these types and function
export type ParkingSpot = {
  id: number;
  name: string;
  distance: string;
  price: string;
  available: number;
  floors?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export const getNearbyParking = async (): Promise<ParkingSpot[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { 
      id: 1, 
      name: "Merkez İstasyon Otoparkı", 
      distance: "0.3 km", 
      price: "₺15/saat", 
      available: 45, 
      floors: 3,
      coordinates: { latitude: 42, longitude: 32 }
    },
    { 
      id: 2, 
      name: "AVM Otoparkı", 
      distance: "0.7 km", 
      price: "₺12/saat", 
      available: 120, 
      floors: 4,
      coordinates: { latitude: 42.1, longitude: 32.1 }
    },
    { 
      id: 3, 
      name: "Şehir Meydanı Otoparkı", 
      distance: "1.1 km", 
      price: "₺10/saat", 
      available: 15, 
      floors: 2,
      coordinates: { latitude: 42.2, longitude: 32.2 }
    },
    { 
      id: 4, 
      name: "Park Caddesi Otoparkı", 
      distance: "1.4 km", 
      price: "₺8/saat", 
      available: 80, 
      floors: 5,
      coordinates: { latitude: 42.3, longitude: 32.3 }
    },
  ];
};

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

// Add this new interface
export interface CurrentParking {
  id: string;
  location: string;
  startTime: string;
  floor: string;
  spot: string;
  cost: number;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Masterpass ile kartını kaydet 500 TL kazan",
    description: "Masterpass ile yapacağınız ödemelerde 500 TL'ye varan bakiye kazan",
    validUntil: "31.12.2024",
    icon: "card",
    color: "#EB001B",
    isActive: true,
    image: "https://www.getirarac.com/Upload/CmsBrand/5-tl-111224_3d1c2b.jpg",
    terms: `• Bu kampanya 31 Aralık 2024 tarihine kadar geçerlidir.
• Kampanyadan yararlanmak için Masterpass hesabınızı Parket uygulamasına bağlamanız gerekmektedir.
• Kampanya kapsamında ilk kez Masterpass ile kart kaydeden kullanıcılara 500 TL'ye varan Parket bakiyesi yüklenecektir.
• Kampanya bakiyesi 30 gün içerisinde kullanılmalıdır.
• Kampanya bakiyesi başka bir hesaba transfer edilemez ve nakde çevrilemez.
• Parket, kampanya koşullarını değiştirme ve kampanyayı sonlandırma hakkını saklı tutar.`,
  },
  {
    id: 2,
    title: "GetirAraç Kullanıcılarına Özel",
    description: "GetirAraç ile kiraladığınız araçlar için İstanbul genelinde AVM ve İSPARK otoparklarında ücretsiz park imkanı!",
    validUntil: "31.12.2024",
    icon: "car",
    color: "#5C3EBC",
    isActive: true,
    image: "https://www.getirarac.com/Upload/CmsBrand/51223_GA_firsat_araclari_banner_768x32_e36eff.jpg",
    terms: `• Kampanya yalnızca GetirAraç üzerinden kiralanan araçlar için geçerlidir.
• Ücretsiz park imkanı, kiralama süresi boyunca geçerlidir.
• Kampanya kapsamındaki otoparklar:
  - Tüm İSPARK otoparkları
  - Forum İstanbul AVM
  - Cevahir AVM
  - Kanyon AVM
  - İstinyePark AVM
• Kampanyadan yararlanmak için GetirAraç hesabınızı Parket uygulamasına bağlamanız gerekmektedir.
• Otoparka giriş ve çıkışlarda plaka tanıma sistemi kullanılacaktır.
• Kampanya kapsamı dışındaki otoparklar için normal tarife uygulanır.`,
  },
  {
    id: 3,
    title: "Havalimanı Transfer İndirimi",
    description: "İstanbul Havalimanı ve Sabiha Gökçen Havalimanı otoparklarında %30 indirim fırsatı!",
    validUntil: "31.12.2024",
    icon: "airplane",
    color: "#007AFF",
    isActive: true,
    image: "https://www.getirarac.com/Upload/CmsBrand/GA-havalimanlari-kampanya-tr-19123_e48325.jpg",
    terms: `• İndirim, İstanbul Havalimanı ve Sabiha Gökçen Havalimanı kapalı otoparklarında geçerlidir.
• Kampanya kapsamında %30 indirim uygulanacaktır.
• Maksimum indirim tutarı günlük 100 TL ile sınırlıdır.
• İndirimden yararlanmak için:
  - Parket uygulaması üzerinden ödeme yapılmalıdır
  - Giriş ve çıkış aynı gün içinde olmalıdır
  - Açık otoparklar kampanya kapsamı dışındadır
• Havalimanı özel günlerinde (bayram, yılbaşı vb.) indirim oranı değişiklik gösterebilir.
• Diğer kampanyalarla birleştirilemez.`,
  },
];

// Add to existing interfaces
export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'info' | 'warning' | 'maintenance';
  isRead: boolean;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Sistem Bakımı",
    description: "16 Mart 2024 tarihinde 02:00-05:00 saatleri arasında sistem bakımı yapılacaktır. Bu süre zarfında uygulama hizmet veremeyecektir.",
    date: "2024-03-15",
    type: "maintenance",
    isRead: false,
  },
  {
    id: 2,
    title: "Yeni Otoparklar Eklendi",
    description: "İstanbul'da 5 yeni otopark lokasyonu hizmet vermeye başlamıştır. Detaylar için haritayı kontrol edebilirsiniz.",
    date: "2024-03-14",
    type: "info",
    isRead: true,
  },
  {
    id: 3,
    title: "Ödeme Sistemi Güncellemesi",
    description: "Yeni ödeme yöntemleri eklenmiştir. Artık Apple Pay ve Google Pay ile ödeme yapabilirsiniz.",
    date: "2024-03-13",
    type: "info",
    isRead: false,
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
  },

  getCurrentParking: async (): Promise<CurrentParking | null> => {
    // Mock data - in real app this would be an API call
    return {
      id: '1',
      location: 'Forum İstanbul AVM',
      startTime: new Date().toISOString(),
      floor: 'B1',
      spot: 'A-15',
      cost: 45.50,
    };
    // Return null when there's no active parking
    // return null;
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_CAMPAIGNS;
  },

  getCampaignById: async (id: number): Promise<Campaign | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CAMPAIGNS.find(campaign => campaign.id === id) || null;
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_ANNOUNCEMENTS;
  },

  markAnnouncementAsRead: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would make an API call
  },
}; 