// Version corrigée - ne s'exécute que côté client
export type NotificationOptions = {
  title: string;
  body: string;
  icon?: string;
  sound?: boolean;
  tag?: string;
};

class NotificationService {
  private audioContext: AudioContext | null = null;
  private permissionGranted = false;
  private isClient = false;

  constructor() {
    // Vérifier si on est côté client
    this.isClient = typeof window !== 'undefined' && typeof window.Notification !== 'undefined';
    if (this.isClient) {
      this.init();
    }
  }

  private init() {
    if (!this.isClient) return;
    
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.log('Notifications non supportées');
      return;
    }

    this.permissionGranted = Notification.permission === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isClient || !('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Notifications refusées par l\'utilisateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (error) {
      console.error('Erreur permission notification:', error);
      return false;
    }
  }

  playSound(type: 'newMessage' | 'notification' | 'error') {
    if (!this.isClient) return;
    
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      let frequency = 800;
      let duration = 0.2;

      switch (type) {
        case 'newMessage':
          frequency = 1000;
          duration = 0.15;
          gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
          break;
        case 'notification':
          frequency = 600;
          duration = 0.3;
          gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
          break;
        case 'error':
          frequency = 400;
          duration = 0.4;
          gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
          break;
      }

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);

    } catch (error) {
      // Silencieux
    }
  }

  showNotification(options: NotificationOptions): void {
    if (!this.isClient || !this.permissionGranted || !('Notification' in window)) {
      console.log(`🔔 ${options.title}: ${options.body}`);
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag || Date.now().toString(),
        requireInteraction: true,
        silent: !options.sound,
      });

      if (options.sound) {
        this.playSound('newMessage');
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);

    } catch (error) {
      console.error('Erreur notification:', error);
    }
  }

  notifyNewMessage(from: string, message: string, sound: boolean = true): void {
    const name = from.replace('@s.whatsapp.net', '');
    this.showNotification({
      title: `💬 Nouveau message de ${name}`,
      body: message.length > 80 ? message.slice(0, 77) + '...' : message,
      sound: sound,
      tag: `msg-${Date.now()}`,
    });
  }

  notifyConnection(status: string): void {
    const isConnected = status === 'open';
    this.showNotification({
      title: isConnected ? '✅ WhatsApp connecté' : '❌ WhatsApp déconnecté',
      body: isConnected ? 'Votre session WhatsApp est active' : 'Veuillez reconnecter WhatsApp',
      sound: false,
      tag: 'connection-status',
    });
  }
}

// Singleton - ne s'initialise que côté client
let serviceInstance: NotificationService | null = null;

export function getNotificationService() {
  if (typeof window === 'undefined') {
    // Retourne un service vide côté serveur
    return {
      requestPermission: async () => false,
      playSound: () => {},
      showNotification: () => {},
      notifyNewMessage: () => {},
      notifyConnection: () => {},
    } as any;
  }
  
  if (!serviceInstance) {
    serviceInstance = new NotificationService();
  }
  return serviceInstance;
}

// Pour compatibilité avec le code existant
export const notificationService = getNotificationService();
