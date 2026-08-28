import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Configuration Orange Money
const ORANGE_BASE_URL = process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/camara/playground';
const ORANGE_CLIENT_ID = process.env.ORANGE_MONEY_CLIENT_ID || 'playground_client';
const ORANGE_CLIENT_SECRET = process.env.ORANGE_MONEY_CLIENT_SECRET || 'playground_secret';
const ORANGE_MERCHANT_ID = process.env.ORANGE_MONEY_MERCHANT_ID || '';

export interface OrangePaymentRequest {
  amount: number;
  phoneNumber: string;
  description: string;
  orderId: string;
}

export interface OrangePaymentResponse {
  success: boolean;
  transactionId?: string;
  authReqId?: string;
  status?: string;
  error?: string;
}

class OrangeMoneyService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  // ============================================================
  // 1. Obtenir le token d'accès
  // ============================================================

  async getAccessToken(): Promise<string> {
    // En mode playground, on peut utiliser un token fixe
    if (process.env.ORANGE_MONEY_ENVIRONMENT === 'playground') {
      return 'playground_token';
    }

    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${ORANGE_BASE_URL}/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${ORANGE_CLIENT_ID}:${ORANGE_CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'authentification Orange Money');
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
      
      return this.accessToken;
    } catch (error: any) {
      console.error('❌ Erreur Orange Money auth:', error.message);
      throw error;
    }
  }

  // ============================================================
  // 2. Gérer les numéros dans le playground
  // ============================================================

  async manageNumber(action: 'CREATE' | 'DELETE' | 'UPDATE', phoneNumber: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${ORANGE_BASE_URL}/api/phone-numbers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action,
          phoneNumber,
        }),
      });

      return await response.json();
    } catch (error: any) {
      console.error('❌ Erreur gestion numéro:', error.message);
      throw error;
    }
  }

  // ============================================================
  // 3. Initier un paiement
  // ============================================================

  async initiatePayment(request: OrangePaymentRequest): Promise<OrangePaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      // En mode playground, on simule le paiement
      if (process.env.ORANGE_MONEY_ENVIRONMENT === 'playground') {
        console.log('🎮 Mode playground - Paiement simulé');
        return {
          success: true,
          transactionId: `ORANGE_${Date.now()}`,
          authReqId: `AUTH_${Date.now()}`,
          status: 'pending',
        };
      }

      // Mode réel - CIBA
      const body = {
        scope: 'openid dpv:OrangeMoney',
        login_hint: `tel:${request.phoneNumber}`,
        amount: request.amount.toString(),
        currency: 'XOF',
        description: request.description,
        order_id: request.orderId,
        merchant_id: ORANGE_MERCHANT_ID,
      };

      const response = await fetch(`${ORANGE_BASE_URL}/camara/playground/api/bc-authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          scope: body.scope,
          login_hint: body.login_hint,
          ...(body.amount && { amount: body.amount }),
          ...(body.currency && { currency: body.currency }),
          ...(body.description && { description: body.description }),
          ...(body.order_id && { order_id: body.order_id }),
          ...(body.merchant_id && { merchant_id: body.merchant_id }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'initiation CIBA');
      }

      return {
        success: true,
        transactionId: `ORANGE_${Date.now()}`,
        authReqId: data.auth_req_id,
        status: 'pending',
      };
    } catch (error: any) {
      console.error('❌ Erreur initiation Orange Money:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ============================================================
  // 4. Vérifier le statut du paiement
  // ============================================================

  async checkPaymentStatus(authReqId: string): Promise<OrangePaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      if (process.env.ORANGE_MONEY_ENVIRONMENT === 'playground') {
        return {
          success: true,
          transactionId: `ORANGE_${Date.now()}`,
          status: 'completed',
        };
      }

      const response = await fetch(`${ORANGE_BASE_URL}/camara/playground/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          grant_type: 'urn:openid:params:grant-type:ciba',
          auth_req_id: authReqId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erreur de vérification',
        };
      }

      return {
        success: true,
        transactionId: data.access_token,
        status: 'completed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const orangeMoneyService = new OrangeMoneyService();
