"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getNotificationService } from '@/lib/whatsapp/notification-service';

type WhatsAppMessage = {
  id: string;
  from: string;
  text: string;
  timestamp: Date;
  fromMe: boolean;
};

type WhatsAppContextType = {
  messages: WhatsAppMessage[];
  lastMessage: WhatsAppMessage | null;
  unreadCount: number;
  isConnected: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  addMessage: (message: WhatsAppMessage) => void;
  markAsRead: () => void;
  toggleSound: () => void;
  toggleDesktopNotifications: () => void;
  requestNotificationPermission: () => Promise<boolean>;
};

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // Récupérer le service de notifications (côté client uniquement)
  const notificationService = typeof window !== 'undefined' ? getNotificationService() : null;

  // Vérifier le statut WhatsApp
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();
        const connected = data.status === 'open';
        
        if (connected !== isConnected) {
          setIsConnected(connected);
          if (desktopNotifications && notificationService) {
            notificationService.notifyConnection(connected ? 'open' : 'closed');
          }
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [isConnected, desktopNotifications]);

  // Demander la permission pour les notifications desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && notificationService) {
      notificationService.requestPermission();
    }
  }, []);

  // Polling pour les nouveaux messages
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const res = await fetch('/api/whatsapp/messages?limit=5');
        const data = await res.json();

        if (data.success && data.messages) {
          const newMessages = data.messages.filter((msg: any) => {
            const msgTime = new Date(msg.timestamp).getTime();
            return msgTime > lastCheck && !msg.fromMe;
          });

          newMessages.forEach((msg: any) => {
            // Notification desktop
            if (desktopNotifications && notificationService) {
              const fromName = msg.senderJid?.replace('@s.whatsapp.net', '') || 'Inconnu';
              notificationService.notifyNewMessage(fromName, msg.text || 'Message reçu', soundEnabled);
            }

            // Toast notification
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                        💬
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Nouveau message WhatsApp
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {msg.text || 'Message reçu'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        De: {msg.senderJid?.replace('@s.whatsapp.net', '') || 'Inconnu'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
                  >
                    Voir
                  </button>
                </div>
              </div>
            ), {
              duration: 8000,
              position: 'top-right',
            });

            setMessages(prev => [msg, ...prev]);
            setUnreadCount(prev => prev + 1);
          });
          
          if (newMessages.length > 0) {
            setLastCheck(Date.now());
          }
        }
      } catch (error) {
        // Silently fail
      }
    };

    const interval = setInterval(pollMessages, 5000);
    return () => clearInterval(interval);
  }, [lastCheck, desktopNotifications, soundEnabled]);

  const addMessage = useCallback((message: WhatsAppMessage) => {
    setMessages(prev => [message, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleDesktopNotifications = useCallback(() => {
    setDesktopNotifications(prev => {
      const newValue = !prev;
      if (newValue && notificationService) {
        notificationService.requestPermission();
      }
      return newValue;
    });
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (notificationService) {
      return await notificationService.requestPermission();
    }
    return false;
  }, []);

  const lastMessage = messages.length > 0 ? messages[0] : null;

  return (
    <WhatsAppContext.Provider
      value={{
        messages,
        lastMessage,
        unreadCount,
        isConnected,
        soundEnabled,
        desktopNotifications,
        addMessage,
        markAsRead,
        toggleSound,
        toggleDesktopNotifications,
        requestNotificationPermission,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
}
