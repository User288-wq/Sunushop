// ============================================================
// 🔔 SERVICE WORKER - PUSH NOTIFICATIONS
// ============================================================

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installé");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activé");
  event.waitUntil(clients.claim());
});

// Gérer les notifications push
self.addEventListener("push", (event) => {
  console.log("📨 Push reçu", event);

  if (!event.data) return;

  try {
    const data = event.data.json();
    console.log("📨 Données push:", data);

    const options = {
      body: data.body || "Nouvelle notification SunuShop",
      icon: data.icon || "/favicon.ico",
      badge: data.badge || "/badge.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/",
        ...(data.data || {}),
      },
      actions: data.actions || [
        {
          action: "open",
          title: "📱 Ouvrir",
        },
        {
          action: "close",
          title: "❌ Fermer",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "🔔 SunuShop",
        options
      )
    );
  } catch (error) {
    console.error("❌ Erreur push:", error);
  }
});

// Gérer le clic sur les notifications
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Clic notification:", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {
      // Vérifier si une fenêtre est déjà ouverte
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log("🔔 Service Worker push ready!");
