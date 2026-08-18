"use client";

import { useState, useEffect } from "react";

export default function PushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Vérifier si les notifications push sont supportées
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker enregistré");
    } catch (error) {
      console.error("❌ Erreur Service Worker:", error);
    }
  };

  const subscribe = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Enregistrer le Service Worker
      await registerServiceWorker();

      // Récupérer les clés VAPID
      const response = await fetch("/api/notification/vapid");
      const vapidKeys = await response.json();

      if (!vapidKeys.publicKey) {
        throw new Error("Clé VAPID manquante");
      }

      // S'abonner aux notifications
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeys.publicKey,
      });

      // Envoyer la subscription au serveur
      const registerRes = await fetch("/api/notification/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          endpoint: subscription.endpoint,
        }),
      });

      if (registerRes.ok) {
        setIsSubscribed(true);
        setMessage("✅ Notifications activées !");
      } else {
        throw new Error("Erreur d'enregistrement");
      }
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    setMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        await fetch("/api/notification/register", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        setIsSubscribed(false);
        setMessage("❌ Notifications désactivées");
      }
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">🔔 Notifications push</h3>
          <p className="text-sm text-gray-500">
            {isSubscribed
              ? "✅ Vous recevez les notifications"
              : "Recevez les alertes en temps réel"}
          </p>
        </div>
        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            isSubscribed
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          {loading
            ? "⏳ Chargement..."
            : isSubscribed
            ? "🔕 Désactiver"
            : "🔔 Activer"}
        </button>
      </div>
      {message && (
        <div className={`mt-2 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
