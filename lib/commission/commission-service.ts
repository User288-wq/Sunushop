// ============================================================
// 💰 SYSTÈME DE COMMISSIONS
// ============================================================

export type CommissionStatus = 'pending' | 'processing' | 'paid' | 'cancelled';

export interface Commission {
  id: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: Date;
  paidAt?: Date;
  description?: string;
}

export interface CommissionSettings {
  baseRate: number; // 0.05 = 5%
  minAmount: number; // Montant minimum pour commission
  maxAmount?: number; // Montant maximum pour commission
  premiumRate: number; // 0.02 = 2% (pour premium)
}

// Configuration des commissions
const DEFAULT_SETTINGS: CommissionSettings = {
  baseRate: 0.05,      // 5% commission standard
  minAmount: 1000,      // Minimum 1000 FCFA
  premiumRate: 0.02,    // 2% pour les vendeurs premium
};

// Commissions en mémoire (remplacer par Firestore en production)
const commissions: Commission[] = [];

class CommissionService {
  private settings: CommissionSettings;

  constructor(settings: CommissionSettings = DEFAULT_SETTINGS) {
    this.settings = settings;
  }

  // ============================================================
  // Calcul des commissions
  // ============================================================

  calculateCommission(amount: number, isPremium: boolean = false): number {
    if (amount < this.settings.minAmount) {
      return 0;
    }

    const rate = isPremium ? this.settings.premiumRate : this.settings.baseRate;
    let commission = amount * rate;

    if (this.settings.maxAmount && commission > this.settings.maxAmount) {
      commission = this.settings.maxAmount;
    }

    return Math.round(commission * 100) / 100;
  }

  // ============================================================
  // Création d'une commission
  // ============================================================

  createCommission(
    sellerId: string,
    sellerName: string,
    orderId: string,
    orderAmount: number,
    isPremium: boolean = false,
    description?: string
  ): Commission {
    const commissionAmount = this.calculateCommission(orderAmount, isPremium);

    const commission: Commission = {
      id: `COM-${Date.now()}`,
      sellerId,
      sellerName,
      orderId,
      orderAmount,
      commissionRate: isPremium ? this.settings.premiumRate : this.settings.baseRate,
      commissionAmount,
      status: 'pending',
      createdAt: new Date(),
      description: description || `Commission pour commande #${orderId}`,
    };

    commissions.push(commission);
    console.log(`💰 Commission créée: ${commissionAmount} FCFA pour ${sellerName}`);

    // Sauvegarder dans Firestore (à implémenter)
    // await this.saveCommission(commission);

    return commission;
  }

  // ============================================================
  // Gestion des commissions
  // ============================================================

  getCommission(id: string): Commission | null {
    return commissions.find(c => c.id === id) || null;
  }

  getSellerCommissions(sellerId: string): Commission[] {
    return commissions.filter(c => c.sellerId === sellerId);
  }

  getPendingCommissions(): Commission[] {
    return commissions.filter(c => c.status === 'pending');
  }

  getTotalCommission(sellerId?: string): number {
    const filtered = sellerId
      ? commissions.filter(c => c.sellerId === sellerId)
      : commissions;
    
    return filtered.reduce((total, c) => {
      if (c.status === 'paid') {
        return total + c.commissionAmount;
      }
      return total;
    }, 0);
  }

  // ============================================================
  // Mise à jour du statut
  // ============================================================

  updateStatus(id: string, status: CommissionStatus): Commission | null {
    const commission = commissions.find(c => c.id === id);
    if (!commission) return null;

    commission.status = status;
    if (status === 'paid') {
      commission.paidAt = new Date();
    }

    console.log(`💰 Commission ${id} mise à jour: ${status}`);
    return commission;
  }

  // ============================================================
  // Statistiques
  // ============================================================

  getStats(sellerId?: string): {
    total: number;
    pending: number;
    paid: number;
    processing: number;
    totalAmount: number;
  } {
    const filtered = sellerId
      ? commissions.filter(c => c.sellerId === sellerId)
      : commissions;

    return {
      total: filtered.length,
      pending: filtered.filter(c => c.status === 'pending').length,
      processing: filtered.filter(c => c.status === 'processing').length,
      paid: filtered.filter(c => c.status === 'paid').length,
      totalAmount: filtered.reduce((sum, c) => sum + c.commissionAmount, 0),
    };
  }

  // ============================================================
  // Récupérer toutes les commissions (admin)
  // ============================================================

  getAllCommissions(): Commission[] {
    return commissions;
  }

  // ============================================================
  // Payer une commission (simulation)
  // ============================================================

  async payCommission(id: string, method: 'wave' | 'orange_money'): Promise<{ success: boolean; message: string }> {
    const commission = commissions.find(c => c.id === id);
    if (!commission) {
      return { success: false, message: 'Commission non trouvée' };
    }

    if (commission.status === 'paid') {
      return { success: false, message: 'Déjà payée' };
    }

    // Simulation de paiement
    console.log(`💰 Paiement de ${commission.commissionAmount} FCFA à ${commission.sellerName} via ${method}`);

    commission.status = 'paid';
    commission.paidAt = new Date();

    return { success: true, message: `Paiement effectué via ${method}` };
  }
}

export const commissionService = new CommissionService();
