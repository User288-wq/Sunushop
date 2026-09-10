import { NextRequest, NextResponse } from "next/server";
import { pushService } from "@/lib/push/push-service";

export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json();
    if (!subscription) {
      return NextResponse.json({ error: "Subscription requise" }, { status: 400 });
    }
    await pushService.saveSubscription(subscription);
    const subs = await pushService.getSubscriptions();
    return NextResponse.json({ success: true, count: subs.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint requis" }, { status: 400 });
    }
    await pushService.removeSubscription(endpoint);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
