"use client";

import PushNotification from "@/components/PushNotification";

export default function TestNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🔔 Test Notifications</h1>
          <p className="text-gray-600 mb-6">
            Activez les notifications push pour recevoir des alertes en temps réel.
          </p>
          
          <PushNotification />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-medium text-blue-800 mb-2">📋 Instructions</h2>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Cliquez sur "Activer"</li>
              <li>Acceptez la demande du navigateur</li>
              <li>Envoyez une notification de test</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
