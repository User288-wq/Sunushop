import { NextResponse } from "next/server";
import { pushService } from "@/lib/push/push-service";

export async function GET() {
  try {
    const subs = await pushService.getSubscriptions();
    return NextResponse.json({
      success: true,
      count: subs.length,
      subscribers: subs.map((sub: any) => ({ endpoint: sub.endpoint })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
