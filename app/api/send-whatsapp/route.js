// app/api/send-whatsapp/route.js
import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_URL || process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

export async function POST(req) {
  try {
    const { number, text, instance } = await req.json();
    const instanceName = instance || EVOLUTION_INSTANCE;
    
    console.log(`📤 [Envoi] Message à ${number}: ${text}`);
    console.log(`📤 Instance: ${instanceName}`);
    
    const url = `${EVOLUTION_URL}/message/sendText/${instanceName}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": EVOLUTION_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        number: number,
        text: text
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const data = await response.json();
    console.log("✅ Message envoyé:", data);

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Erreur envoi:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
