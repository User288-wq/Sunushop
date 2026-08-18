"use client";

import { useEffect, useState } from "react";
import { useWhatsApp } from "@/context/WhatsAppContext";

export default function WhatsAppNotification() {
  const { unreadCount, lastMessage, isConnected } = useWhatsApp();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    setShowDot(unreadCount > 0);
  }, [unreadCount]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showDot && (
        <div className="relative">
          <button
            onClick={() => {
              // Naviguer vers la page WhatsApp
              window.location.href = "/whatsapp";
            }}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-2xl">💬</span>
            <span className="text-sm font-medium">
              {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} message{unreadCount > 1 ? "s" : ""}
            </span>
          </button>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
            {unreadCount}
          </div>
        </div>
      )}
    </div>
  );
}
