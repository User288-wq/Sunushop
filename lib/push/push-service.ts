// lib/push/push-service.ts
import webpush from "web-push";

export interface PushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string; };
  userId?: string;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: Record<string, any>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

let vapidConfigured = false;

function ensureVapid(): boolean {
  if (vapidConfigured) return true;
  const publicKey = process.env.VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const subject = process.env.VAPID_SUBJECT || "mailto:support@sunu-shop.org";
  if (!publicKey || !privateKey) {
    console.warn("VAPID keys not configured");
    return false;
  }
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    vapidConfigured = true;
    console.log("VAPID configured");
    return true;
  } catch (error: any) {
    console.error("VAPID failed:", error.message);
    return false;
  }
}

class PushService {
  private subscriptions: PushSubscription[] = [];

  // SYNCHRONE - utilisé par les routes sans await
  saveSubscription(subscription: PushSubscription, userId?: string) {
    const sub = { ...subscription, userId };
    const existing = this.subscriptions.findIndex(s => s.endpoint === subscription.endpoint);
    if (existing >= 0) this.subscriptions[existing] = sub;
    else this.subscriptions.push(sub);
    console.log("Subscription saved:", subscription.endpoint);
    return { success: true };
  }

  // SYNCHRONE - retourne un tableau, pas une Promise
  getSubscriptions(): PushSubscription[] {
    return this.subscriptions;
  }

  // SYNCHRONE
  removeSubscription(endpoint: string) {
    this.subscriptions = this.subscriptions.filter(s => s.endpoint !== endpoint);
    console.log("Subscription removed:", endpoint);
    return { success: true };
  }

  // ASYNCHRONE - envoi à un abonné
  async send(subscription: PushSubscription, notification: PushNotification) {
    try {
      if (!ensureVapid()) return { success: false, error: "VAPID not configured" };
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || "/icon-192.png",
        url: notification.url || "/",
        data: notification.data || {},
        actions: notification.actions || [],
      });
      await webpush.sendNotification(subscription as any, payload);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async sendPushNotification(subscription: PushSubscription, notification: PushNotification) {
    return this.send(subscription, notification);
  }

  async sendToMultiple(subscriptions: PushSubscription[], notification: PushNotification) {
    let sent = 0, failed = 0;
    for (const sub of subscriptions) {
      const r = await this.send(sub, notification);
      if (r.success) sent++; else failed++;
    }
    return { sent, failed };
  }

  async broadcastNotification(notification: PushNotification) {
    const subs = this.getSubscriptions();
    return this.sendToMultiple(subs, notification);
  }

  async getSubscribers(): Promise<PushSubscription[]> {
    return this.getSubscriptions();
  }

  async register(subscription: PushSubscription, userId?: string) {
    return this.saveSubscription(subscription, userId);
  }

  async unregister(endpoint: string) {
    return this.removeSubscription(endpoint);
  }

  async sendToAll(notification: PushNotification) {
    return this.broadcastNotification(notification);
  }
}

export const pushService = new PushService();

export async function sendPushNotification(subscription: PushSubscription, notification: PushNotification) {
  return pushService.send(subscription, notification);
}

export async function sendPushToMultiple(subscriptions: PushSubscription[], notification: PushNotification) {
  return pushService.sendToMultiple(subscriptions, notification);
}

export { ensureVapid };
export default webpush;
