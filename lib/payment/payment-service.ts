import axios from 'axios';

// ============================================================
// Types
// ============================================================

export type PaymentMethod = 'wave' | 'orange_money' | 'cash_on_delivery';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  method: PaymentMethod;
  orderId: string;
  description?: string;
  callbackUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  reference?: string;
  message?: string;
  error?: string;
  status: PaymentStatus;
}

// ============================================================
// Wave API (Sandbox)
// ============================================================

const WAVE_API_URL = process.env.WAVE_ENVIRONMENT === 'production'
  ? 'https://api.wave.com/v1'
  : 'https://sandbox.wave.com/v1';

class WavePaymentService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.WAVE_API_KEY || '';
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log(`💳 Wave: Initiation paiement ${request.amount} FCFA pour ${request.phoneNumber}`);

      if (process.env.WAVE_ENVIRONMENT !== 'production') {
        return {
          success: true,
          transactionId: `WAVE_${Date.now()}`,
          reference: `WAVE_REF_${Date.now()}`,
          paymentUrl: `https://sandbox.wave.com/pay/${Date.now()}`,
          message: 'Paiement Wave initié (sandbox)',
          status: 'pending',
        };
      }

      const response = await axios.post(
        `${WAVE_API_URL}/payments`,
        {
          amount: request.amount,
          currency: 'XOF',
          mobileMoney: {
            phone: request.phoneNumber,
            provider: 'WAVE',
          },
          reference: `ORDER_${request.orderId}`,
          description: request.description || `Commande #${request.orderId}`,
          callbackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/wave/webhook`,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        transactionId: response.data.id,
        reference: response.data.reference,
        paymentUrl: response.data.payment_url,
        message: 'Paiement Wave initié',
        status: 'pending',
      };
    } catch (error: any) {
      console.error('❌ Erreur Wave:', error.message);
      return {
        success: false,
        error: error.message || 'Erreur de paiement Wave',
        status: 'failed',
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      if (process.env.WAVE_ENVIRONMENT !== 'production') {
        return {
          success: true,
          transactionId,
          status: 'completed',
          message: 'Paiement Wave confirmé (sandbox)',
        };
      }

      const response = await axios.get(
        `${WAVE_API_URL}/payments/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const status = response.data.status === 'completed' ? 'completed' : 'pending';

      return {
        success: status === 'completed',
        transactionId,
        status,
        message: `Paiement Wave ${status}`,
      };
    } catch (error: any) {
      console.error('❌ Erreur Wave status:', error.message);
      return {
        success: false,
        transactionId,
        status: 'failed',
        error: error.message,
      };
    }
  }
}

// ============================================================
// Orange Money API
// ============================================================

const ORANGE_API_URL = process.env.ORANGE_MONEY_ENVIRONMENT === 'production'
  ? process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com'
  : 'https://api.orange.com/sandbox';

class OrangeMoneyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.ORANGE_MONEY_CLIENT_ID || '';
    this.clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(
        `${ORANGE_API_URL}/oauth/v3/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken || '';
    } catch (error: any) {
      console.error('❌ Erreur token Orange Money:', error.message);
      throw new Error('Impossible d\'obtenir le token Orange Money');
    }
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log(`📱 Orange Money: Initiation paiement ${request.amount} FCFA pour ${request.phoneNumber}`);

      if (process.env.ORANGE_MONEY_ENVIRONMENT !== 'production') {
        return {
          success: true,
          transactionId: `ORANGE_${Date.now()}`,
          reference: `ORANGE_REF_${Date.now()}`,
          paymentUrl: `https://sandbox.orange.com/pay/${Date.now()}`,
          message: 'Paiement Orange Money initié (sandbox)',
          status: 'pending',
        };
      }

      const token = await this.getAccessToken();

      const response = await axios.post(
        `${ORANGE_API_URL}/payment/v1/payments`,
        {
          amount: request.amount,
          currency: 'XOF',
          phoneNumber: request.phoneNumber,
          reference: `ORDER_${request.orderId}`,
          description: request.description || `Commande #${request.orderId}`,
          callbackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/orange/webhook`,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        transactionId: response.data.id,
        reference: response.data.reference,
        paymentUrl: response.data.payment_url,
        message: 'Paiement Orange Money initié',
        status: 'pending',
      };
    } catch (error: any) {
      console.error('❌ Erreur Orange Money:', error.message);
      return {
        success: false,
        error: error.message || 'Erreur de paiement Orange Money',
        status: 'failed',
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      if (process.env.ORANGE_MONEY_ENVIRONMENT !== 'production') {
        return {
          success: true,
          transactionId,
          status: 'completed',
          message: 'Paiement Orange Money confirmé (sandbox)',
        };
      }

      const token = await this.getAccessToken();

      const response = await axios.get(
        `${ORANGE_API_URL}/payment/v1/payments/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const status = response.data.status === 'completed' ? 'completed' : 'pending';

      return {
        success: status === 'completed',
        transactionId,
        status,
        message: `Paiement Orange Money ${status}`,
      };
    } catch (error: any) {
      console.error('❌ Erreur Orange Money status:', error.message);
      return {
        success: false,
        transactionId,
        status: 'failed',
        error: error.message,
      };
    }
  }
}

// ============================================================
// Service Principal
// ============================================================

class PaymentService {
  private waveService: WavePaymentService;
  private orangeService: OrangeMoneyService;

  constructor() {
    this.waveService = new WavePaymentService();
    this.orangeService = new OrangeMoneyService();
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    switch (request.method) {
      case 'wave':
        return this.waveService.initiatePayment(request);
      case 'orange_money':
        return this.orangeService.initiatePayment(request);
      case 'cash_on_delivery':
        return {
          success: true,
          status: 'pending',
          message: 'Paiement à la livraison sélectionné',
        };
      default:
        return {
          success: false,
          error: 'Méthode de paiement non supportée',
          status: 'failed',
        };
    }
  }

  async checkPaymentStatus(method: PaymentMethod, transactionId: string): Promise<PaymentResponse> {
    switch (method) {
      case 'wave':
        return this.waveService.checkPaymentStatus(transactionId);
      case 'orange_money':
        return this.orangeService.checkPaymentStatus(transactionId);
      case 'cash_on_delivery':
        return {
          success: true,
          status: 'pending',
          message: 'Paiement à la livraison en attente',
        };
      default:
        return {
          success: false,
          error: 'Méthode de paiement non supportée',
          status: 'failed',
        };
    }
  }

  getAvailableMethods(): PaymentMethod[] {
    return ['wave', 'orange_money', 'cash_on_delivery'];
  }
}

export const paymentService = new PaymentService();
