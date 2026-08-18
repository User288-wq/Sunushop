import webpush from 'web-push';

// Configuration VAPID
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:support@sunu-shop.org',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: any;
  actions?: { action: string; title: string }[];
}

// Stockage des subscriptions (remplacer par Firestore)
let subscriptions: PushSubscription[] = [];

class PushService {
  // ============================================================
  // Gestion des subscriptions
  // ============================================================

  saveSubscription(subscription: PushSubscription): void {
    const exists = subscriptions.some(
      (s) => s.endpoint === subscription.endpoint
    );

    if (!exists) {
      subscriptions.push(subscription);
      console.log(`✅ Subscription enregistrée: ${subscription.endpoint}`);
    }
  }

  removeSubscription(endpoint: string): void {
    subscriptions = subscriptions.filter((s) => s.endpoint !== endpoint);
    console.log(`🗑️ Subscription supprimée: ${endpoint}`);
  }

  getSubscriptions(): PushSubscription[] {
    return subscriptions;
  }

  // ============================================================
  // Envoi de notifications
  // ============================================================

  async sendNotification(
    subscription: PushSubscription,
    notification: PushNotification
  ): Promise<boolean> {
    try {
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/badge.png',
        url: notification.url || '/',
        data: notification.data || {},
        actions: notification.actions || [
          { action: 'open', title: '📱 Ouvrir' },
          { action: 'close', title: '❌ Fermer' },
        ],
      });

      await webpush.sendNotification(subscription, payload);
      console.log(`📨 Notification envoyée à ${subscription.endpoint}`);
      return true;
    } catch (error: any) {
      console.error('❌ Erreur envoi push:', error.message);

      // Si la subscription est invalide, la supprimer
      if (error.statusCode === 410 || error.statusCode === 404) {
        this.removeSubscription(subscription.endpoint);
      }

      return false;
    }
  }

  // ============================================================
  // Envoi à tous les abonnés
  // ============================================================

  async broadcastNotification(notification: PushNotification): Promise<void> {
    console.log(`📨 Broadcast à ${subscriptions.length} abonnés`);

    const promises = subscriptions.map((sub) =>
      this.sendNotification(sub, notification)
    );

    await Promise.all(promises);
  }

  // ============================================================
  // Notifications spécifiques
  // ============================================================

  async notifyNewMessage(from: string, message: string, url?: string): Promise<void> {
    await this.broadcastNotification({
      title: `💬 Nouveau message de ${from}`,
      body: message.length > 100 ? message.slice(0, 97) + '...' : message,
      icon: '/whatsapp-icon.png',
      badge: '/badge.png',
      url: url || '/chat',
      data: { from, message },
    });
  }

  async notifyNewOrder(orderId: string, client: string, amount: number): Promise<void> {
    await this.broadcastNotification({
      title: `📦 Nouvelle commande #${orderId}`,
      body: `${client} a passé une commande de ${amount.toLocaleString()} FCFA`,
      icon: '/order-icon.png',
      badge: '/badge.png',
      url: `/vendeur/commandes`,
      data: { orderId, client, amount },
    });
  }

  async notifyOrderStatus(orderId: string, status: string): Promise<void> {
    await this.broadcastNotification({
      title: `🔄 Commande #${orderId}`,
      body: `Statut mis à jour: ${status}`,
      icon: '/order-icon.png',
      badge: '/badge.png',
      url: `/livreur/dashboard`,
      data: { orderId, status },
    });
  }

  async notifyLowStock(productName: string, quantity: number): Promise<void> {
    await this.broadcastNotification({
      title: `⚠️ Stock faible: ${productName}`,
      body: `Il ne reste plus que ${quantity} unités en stock`,
      icon: '/stock-icon.png',
      badge: '/badge.png',
      url: `/stock/dashboard`,
      data: { productName, quantity },
    });
  }

  async notifyWhatsAppDisconnected(): Promise<void> {
    await this.broadcastNotification({
      title: '⚠️ WhatsApp déconnecté',
      body: 'La session WhatsApp a été déconnectée. Veuillez reconnecter.',
      icon: '/whatsapp-icon.png',
      badge: '/badge.png',
      url: '/whatsapp',
      actions: [
        { action: 'reconnect', title: '🔄 Reconnecter' },
        { action: 'open', title: '📱 Ouvrir' },
        { action: 'close', title: '❌ Fermer' },
      ],
    });
  }
}

export const pushService = new PushService();
