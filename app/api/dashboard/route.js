// app/api/dashboard/route.js
import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_URL || process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

export async function GET() {
  try {
    console.log("📊 Dashboard API - Récupération des instances...");
    console.log("URL:", EVOLUTION_URL);
    console.log("Instance:", EVOLUTION_INSTANCE);
    
    const url = `${EVOLUTION_URL}/instance/fetchInstances`;
    const response = await fetch(url, {
      headers: { 
        "apikey": EVOLUTION_KEY,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const instances = await response.json();
    console.log("✅ Instances récupérées:", instances);

    let instanceStats = null;
    if (instances && instances.length > 0) {
      try {
        const statsUrl = `${EVOLUTION_URL}/instance/status/${EVOLUTION_INSTANCE}`;
        const statsResponse = await fetch(statsUrl, {
          headers: { "apikey": EVOLUTION_KEY },
          cache: "no-store"
        });
        if (statsResponse.ok) {
          instanceStats = await statsResponse.json();
        }
      } catch (statsError) {
        console.log("⚠️ Statistiques non disponibles");
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        instances: instances,
        stats: instanceStats,
        instanceName: EVOLUTION_INSTANCE,
        connected: instances && instances.length > 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Erreur dashboard:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
