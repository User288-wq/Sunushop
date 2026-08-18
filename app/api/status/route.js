// app/api/status/route.js
import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_URL || process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

export async function GET() {
  try {
    console.log("🔍 Vérification du statut de l'instance...");
    
    const url = `${EVOLUTION_URL}/instance/status/${EVOLUTION_INSTANCE}`;
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

    const data = await response.json();
    console.log("✅ Statut:", data);

    return NextResponse.json({
      success: true,
      data: data,
      instance: EVOLUTION_INSTANCE,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Erreur statut:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      instance: EVOLUTION_INSTANCE,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
