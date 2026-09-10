// lib/push/push-service.ts
import webpush from "web-push";

export interface PushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string; };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: Record<string, any>;
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
  async send(subscription: PushSubscription, notification: PushNotification) {
    try {
      if (!ensureVapid()) return { success: false, error: "VAPID not configured" };
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || "/icon-192.png",
        url: notification.url || "/",
        data: notification.data || {},
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

  async register(subscription: PushSubscription, userId?: string) {
    console.log("Register push:", userId || "anonyme");
    return { success: true };
  }

  async subscribe(subscription: PushSubscription, userId?: string) {
    return this.register(subscription, userId);
  }

  async getSubscribers(): Promise<PushSubscription[]> {
    return [];
  }

  async sendToAll(notification: PushNotification) {
    const subs = await this.getSubscribers();
    return this.sendToMultiple(subs, notification);
  }

  async unregister(endpoint: string) {
    console.log("Unregister:", endpoint);
    return { success: true };
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
