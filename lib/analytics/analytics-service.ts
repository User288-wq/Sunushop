// ============================================================
// 📊 ANALYTICS SERVICE - Version finale
// ============================================================

type EventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'purchase'
  | 'whatsapp_send'
  | 'whatsapp_receive'
  | 'share_tiktok'
  | 'share_facebook'
  | 'share_instagram'
  | 'share_whatsapp'
  | 'order_created'
  | 'order_status_update'
  | 'livreur_location'
  | 'payment_init'
  | 'payment_success'
  | 'payment_failed'
  | 'error'
  | 'user_login'
  | 'user_register'
  | 'product_publish'
  | 'whatsapp_connected'
  | 'whatsapp_disconnected';

interface AnalyticsEvent {
  type: EventType;
  data?: any;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
}

interface AnalyticsStats {
  total: number;
  byType: Record<string, number>;
  byDay: Record<string, number>;
  byHour: Record<string, number>;
  byCountry: Record<string, number>;
  topProducts: { id: string; name: string; count: number }[];
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  revenue: number;
  ordersCount: number;
  whatsappMessages: number;
}

class AnalyticsService {
  private sessionId: string;
  private sessionStart: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.init();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private init() {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('sunushop_session');
      if (storedSession) {
        this.sessionId = storedSession;
      } else {
        localStorage.setItem('sunushop_session', this.sessionId);
      }
    }
  }

  async track(event: EventType, data?: any, userId?: string): Promise<void> {
    try {
      const payload: AnalyticsEvent = {
        type: event,
        data,
        userId: userId || this.getUserId(),
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 [Analytics]', event, data);
      }
    } catch (error) {
      // Silently fail
    }
  }

  private getUserId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sunushop_user') || '';
    }
    return '';
  }

  // ============================================================
  // Événements spécifiques
  // ============================================================

  trackPageView(page: string): void {
    this.track('page_view', { page });
  }

  trackProductView(productId: string, productName: string, price: number): void {
    this.track('product_view', { productId, productName, price });
  }

  trackAddToCart(productId: string, quantity: number, price: number): void {
    this.track('add_to_cart', { productId, quantity, price });
  }

  trackPurchase(orderId: string, total: number, items: any[]): void {
    this.track('purchase', { orderId, total, items });
  }

  trackWhatsAppSend(to: string, message: string): void {
    this.track('whatsapp_send', { to, messageLength: message.length });
  }

  trackWhatsAppReceive(from: string, message: string): void {
    this.track('whatsapp_receive', { from, messageLength: message.length });
  }

  trackShare(platform: string, productId: string): void {
    this.track(`share_${platform}` as EventType, { productId, platform });
  }

  trackOrderStatus(orderId: string, status: string): void {
    this.track('order_status_update', { orderId, status });
  }

  trackPayment(method: string, amount: number, success: boolean): void {
    this.track(success ? 'payment_success' : 'payment_failed', { method, amount });
  }

  trackUserAction(action: 'login' | 'register', email: string): void {
    this.track(action === 'login' ? 'user_login' : 'user_register', { email });
  }

  trackProductPublish(productId: string, productName: string): void {
    this.track('product_publish', { productId, productName });
  }

  trackWhatsAppConnection(status: 'connected' | 'disconnected'): void {
    this.track(status === 'connected' ? 'whatsapp_connected' : 'whatsapp_disconnected', { status });
  }

  trackError(error: string, context?: any): void {
    this.track('error', { error, context });
  }

  // ============================================================
  // Métriques de session
  // ============================================================

  getSessionDuration(): number {
    return Math.floor((Date.now() - this.sessionStart) / 1000);
  }

  resetSession(): void {
    this.sessionStart = Date.now();
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      localStorage.setItem('sunushop_session', this.sessionId);
    }
  }
}

export const analyticsService = new AnalyticsService();

export function useAnalytics() {
  return analyticsService;
}
