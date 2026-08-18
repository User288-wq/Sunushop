"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    L: any;
  }
}

interface Commande {
  id: string;
  client: string;
  telephone: string;
  adresse: string;
  produits: string[];
  total: number;
  status: "en_attente" | "en_cours" | "livré" | "annulé";
  created_at: string;
  livraison?: {
    lat: number;
    lng: number;
  };
}

interface Position {
  lat: number;
  lng: number;
}

export default function LivreurDashboard() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [stats, setStats] = useState({ total: 0, en_attente: 0, en_cours: 0, livré: 0 });
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [tracking, setTracking] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const livreurId = "LIV-001";

  const fetchCommandes = async () => {
    try {
      const res = await fetch(`/api/livreur/commandes?livreurId=${livreurId}`);
      const data = await res.json();
      if (data.success) {
        setCommandes(data.commandes);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = async (lat: number, lng: number) => {
    try {
      await fetch("/api/livreur/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ livreurId, lat, lng }),
      });
      setPosition({ lat, lng });
    } catch (error) {
      console.error("Erreur mise à jour position:", error);
    }
  };

  const startTracking = (): number => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée par votre navigateur");
      return -1;
    }

    setTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        updatePosition(latitude, longitude);

        if (map && window.L) {
          const newPos = [latitude, longitude];
          map.setView(newPos, 15);

          markers.forEach((m) => {
            if (m.options.icon?.options?.className?.includes("livreur-marker")) {
              map.removeLayer(m);
            }
          });

          const livreurIcon = window.L.divIcon({
            className: "livreur-marker",
            html: '<div class="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xl animate-pulse">🚚</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = window.L.marker(newPos, { icon: livreurIcon })
            .addTo(map)
            .bindPopup("🚚 Vous êtes ici");

          setMarkers([...markers, marker]);
        }
      },
      (error) => {
        console.error("Erreur GPS:", error);
        alert("Impossible d'obtenir votre position. Vérifiez les permissions.");
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = watchId;
    return watchId;
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const L = (window as any).L;
        if (L) {
          const mapInstance = L.map(mapRef.current!).setView([14.7167, -17.4677], 13);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
            maxZoom: 19,
          }).addTo(mapInstance);
          setMap(mapInstance);
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    fetchCommandes();
  }, []);

  useEffect(() => {
    if (position) return;
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  const updateCommandeStatus = async (commandeId: string, status: string) => {
    try {
      const res = await fetch("/api/livreur/commandes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandeId, status }),
      });
      if (res.ok) fetchCommandes();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "en_cours": return "bg-blue-100 text-blue-700 border-blue-300";
      case "livré": return "bg-green-100 text-green-700 border-green-300";
      case "annulé": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente": return "⏳ En attente";
      case "en_cours": return "🚚 En cours";
      case "livré": return "✅ Livré";
      case "annulé": return "❌ Annulé";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">🚚 Dashboard Livreur</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {tracking ? "🟢 Suivi actif" : "⛔ Suivi arrêté"}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {position && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                📍 {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            )}
            <button
              onClick={() => {
                if (tracking) {
                  stopTracking();
                } else {
                  startTracking();
                }
              }}
              className={`px-4 py-2 rounded-lg text-white transition ${
                tracking ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {tracking ? "⏹ Arrêter" : "▶️ Démarrer"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.en_attente}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
            <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Livrées</p>
            <p className="text-2xl font-bold text-green-600">{stats.livré}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🗺️ Localisation</h2>
            <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden bg-gray-200" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">📌 Votre position est mise à jour en temps réel</p>
          </div>

          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📦 Commandes</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {commandes.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune commande assignée</p>
              ) : (
                commandes.map((commande) => (
                  <div
                    key={commande.id}
                    className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedCommande(commande)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 dark:text-white">{commande.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commande.status)}`}>
                            {getStatusLabel(commande.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{commande.client}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{commande.adresse}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{commande.total.toLocaleString()} FCFA</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(commande.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {commande.status !== "livré" && commande.status !== "annulé" && (
                      <div className="mt-3 flex gap-2">
                        {commande.status === "en_attente" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCommandeStatus(commande.id, "en_cours"); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            🚚 Prendre en charge
                          </button>
                        )}
                        {commande.status === "en_cours" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCommandeStatus(commande.id, "livré"); }}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                          >
                            ✅ Marquer livré
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
