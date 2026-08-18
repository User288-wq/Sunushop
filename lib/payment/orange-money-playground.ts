import axios from 'axios';

// ============================================================
// ORANGE MONEY API - Playground
// ============================================================

const ORANGE_API_URL = 'https://api.orange.com';

export interface OrangeTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export interface OrangeAdminAction {
  action: 'LIST' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  phoneNumber?: string;
  data?: any;
}

export interface OrangeAdminResponse {
  phoneNumbers?: string[];
  data?: any;
}

export interface SimulatedData {
  location?: {
    lastLocationTime?: string;
    available?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  reachability?: {
    lastStatusTime?: string;
    reachabilityStatus?: 'CONNECTED_DATA' | 'CONNECTED_SMS' | 'NOT_CONNECTED';
  };
  simSwap?: {
    latestSimChange?: string;
  };
  kyc?: {
    name?: string;
    givenName?: string;
    familyName?: string;
    email?: string;
    address?: string;
    birthdate?: string;
  };
}

class OrangeMoneyPlaygroundService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.ORANGE_MONEY_CLIENT_ID || '';
    this.clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET || '';
  }

  // ============================================================
  // 1. Obtenir un token OAuth (v3)
  // ============================================================

  async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post<OrangeTokenResponse>(
        `${ORANGE_API_URL}/oauth/v3/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('✅ Token Orange Money obtenu');
      
      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      // S'assurer que le token n'est pas null
      return this.accessToken || '';
    } catch (error: any) {
      console.error('❌ Erreur token Orange Money:', error.response?.data || error.message);
      throw new Error('Impossible d\'obtenir le token Orange Money');
    }
  }

  // ============================================================
  // 2. Effectuer une action admin
  // ============================================================

  async adminAction(actionData: OrangeAdminAction): Promise<OrangeAdminResponse> {
    try {
      const token = await this.getToken();

      const response = await axios.post<OrangeAdminResponse>(
        `${ORANGE_API_URL}/camara/playground/admin/v1.0/action`,
        actionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Action Orange Money "${actionData.action}" réussie`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur action Orange Money:`, error.response?.data || error.message);
      throw new Error(`Erreur Orange Money: ${error.response?.data?.message || error.message}`);
    }
  }

  // ============================================================
  // 3. Méthodes simplifiées
  // ============================================================

  async listPhoneNumbers(): Promise<string[]> {
    const result = await this.adminAction({ action: 'LIST' });
    return result.phoneNumbers || [];
  }

  async createPhoneNumber(phoneNumber: string): Promise<any> {
    return this.adminAction({
      action: 'CREATE',
      phoneNumber,
    });
  }

  async readPhoneNumber(phoneNumber: string): Promise<any> {
    const result = await this.adminAction({
      action: 'READ',
      phoneNumber,
    });
    return result.data;
  }

  // ============================================================
  // 4. Mettre à jour un numéro avec des données simulées
  // ============================================================

  async updatePhoneNumber(phoneNumber: string, data: SimulatedData): Promise<any> {
    return this.adminAction({
      action: 'UPDATE',
      phoneNumber,
      data,
    });
  }

  // ============================================================
  // 5. Méthodes de simulation pour les tests
  // ============================================================

  async simulateConnectedUser(phoneNumber: string): Promise<any> {
    return this.updatePhoneNumber(phoneNumber, {
      location: {
        lastLocationTime: new Date().toISOString(),
        available: true,
        latitude: 14.7167,
        longitude: -17.4677,
        radius: 800,
      },
      reachability: {
        lastStatusTime: new Date().toISOString(),
        reachabilityStatus: 'CONNECTED_DATA',
      },
      simSwap: {
        latestSimChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }

  async simulateDisconnectedUser(phoneNumber: string): Promise<any> {
    return this.updatePhoneNumber(phoneNumber, {
      reachability: {
        lastStatusTime: new Date().toISOString(),
        reachabilityStatus: 'NOT_CONNECTED',
      },
    });
  }

  async simulateSimSwapRisk(phoneNumber: string): Promise<any> {
    return this.updatePhoneNumber(phoneNumber, {
      simSwap: {
        latestSimChange: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    });
  }

  async simulateLocation(phoneNumber: string, lat: number, lng: number): Promise<any> {
    return this.updatePhoneNumber(phoneNumber, {
      location: {
        lastLocationTime: new Date().toISOString(),
        available: true,
        latitude: lat,
        longitude: lng,
        radius: 800,
      },
    });
  }

  async deletePhoneNumber(phoneNumber: string): Promise<any> {
    return this.adminAction({
      action: 'DELETE',
      phoneNumber,
    });
  }

  async checkReachability(phoneNumber: string): Promise<any> {
    const data = await this.readPhoneNumber(phoneNumber);
    return data?.reachability || null;
  }

  async checkLocation(phoneNumber: string): Promise<any> {
    const data = await this.readPhoneNumber(phoneNumber);
    return data?.location || null;
  }
}

export const orangeMoneyPlayground = new OrangeMoneyPlaygroundService();
