"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  service: string;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

export default function MonitoringPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/log");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-700 border-red-300";
      case "warn":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Monitoring</h1>
            <p className="text-gray-600 mt-1">Logs et performances en temps réel</p>
          </div>
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Rafraîchir
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-500">Total logs: {logs.length}</span>
            <span className="text-sm text-gray-500">
              {logs.filter((l) => l.level === "error").length} erreurs
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun log</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${getLevelColor(log.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-white/50">
                        {log.service}
                      </span>
                      <p className="mt-1 font-medium">{log.message}</p>
                      {log.data && (
                        <pre className="mt-1 text-xs bg-black/5 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
