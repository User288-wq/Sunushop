import { NextRequest, NextResponse } from "next/server";
import { pushService } from "@/lib/push/push-service";

export async function POST(req: NextRequest) {
  try {
    const { title, body, icon, badge, url, data, actions } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: "Titre et corps requis" }, { status: 400 });
    }
    const result = await pushService.broadcastNotification({
      title, body, icon, badge, url, data, actions,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
