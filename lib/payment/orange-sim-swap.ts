import axios from 'axios';
import { orangeMoneyPlayground } from './orange-money-playground';

// ============================================================
// ORANGE SIM SWAP API
// ============================================================

const ORANGE_API_URL = 'https://api.orange.com';

export interface SimSwapRequest {
  phoneNumber: string;
  maxAge?: number; // Temps maximum en minutes (défaut: 240)
}

export interface SimSwapResponse {
  swapped: boolean;
  latestSimChange?: string;
  timestamp?: string;
}

class OrangeSimSwapService {
  
  // ============================================================
  // Vérifier le changement de SIM
  // ============================================================

  async checkSimSwap(request: SimSwapRequest): Promise<SimSwapResponse> {
    try {
      // Obtenir le token
      const token = await orangeMoneyPlayground.getToken();

      const response = await axios.post<SimSwapResponse>(
        `${ORANGE_API_URL}/camara/playground/api/sim-swap/v1/check`,
        {
          phoneNumber: request.phoneNumber,
          maxAge: request.maxAge || 240,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ SIM Swap check pour ${request.phoneNumber}: swapped=${response.data.swapped}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur SIM Swap:', error.response?.data || error.message);
      throw new Error(`Erreur SIM Swap: ${error.response?.data?.message || error.message}`);
    }
  }

  // ============================================================
  // Vérifier la sécurité d'un paiement
  // ============================================================

  async isPaymentSecure(phoneNumber: string): Promise<{ secure: boolean; message: string }> {
    try {
      const result = await this.checkSimSwap({ phoneNumber, maxAge: 240 });
      
      if (result.swapped) {
        return {
          secure: false,
          message: '⚠️ Attention: La SIM a été changée récemment. Vérification supplémentaire requise.',
        };
      }
      
      return {
        secure: true,
        message: '✅ Paiement sécurisé: Aucun changement de SIM récent détecté.',
      };
    } catch (error) {
      return {
        secure: false,
        message: '❌ Impossible de vérifier la sécurité du paiement.',
      };
    }
  }
}

export const orangeSimSwap = new OrangeSimSwapService();
