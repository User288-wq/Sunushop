import { NextRequest, NextResponse } from 'next/server';
import { orangeMoneyPlayground } from '@/lib/payment/orange-money-playground';
import { orangeSimSwap } from '@/lib/payment/orange-sim-swap';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get('phoneNumber');
    const action = searchParams.get('action');

    if (action === 'simswap' && phoneNumber) {
      const result = await orangeSimSwap.checkSimSwap({ phoneNumber });
      return NextResponse.json({ success: true, action: 'simswap', data: result });
    }

    if (action === 'secure' && phoneNumber) {
      const result = await orangeSimSwap.isPaymentSecure(phoneNumber);
      return NextResponse.json({ success: true, action: 'secure', data: result });
    }

    if (phoneNumber) {
      const data = await orangeMoneyPlayground.readPhoneNumber(phoneNumber);
      return NextResponse.json({ success: true, data });
    }

    const numbers = await orangeMoneyPlayground.listPhoneNumbers();
    return NextResponse.json({ success: true, phoneNumbers: numbers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, phoneNumber, data } = await req.json();
    let result;

    switch (action) {
      case 'CREATE':
        result = await orangeMoneyPlayground.createPhoneNumber(phoneNumber);
        break;
      case 'UPDATE':
        result = await orangeMoneyPlayground.updatePhoneNumber(phoneNumber, data);
        break;
      case 'CHECK':
        const info = await orangeMoneyPlayground.readPhoneNumber(phoneNumber);
        result = { reachability: info?.reachability, location: info?.location, roaming: info?.roaming, kyc: info?.kyc };
        break;
      case 'SIMSWAP':
        result = await orangeSimSwap.checkSimSwap({ phoneNumber, maxAge: data?.maxAge || 240 });
        break;
      case 'SECURE':
        result = await orangeSimSwap.isPaymentSecure(phoneNumber);
        break;
      case 'SIMULATE_CONNECTED':
        result = await orangeMoneyPlayground.simulateConnectedUser(phoneNumber);
        break;
      case 'SIMULATE_DISCONNECTED':
        result = await orangeMoneyPlayground.simulateDisconnectedUser(phoneNumber);
        break;
      case 'SIMULATE_RISK':
        result = await orangeMoneyPlayground.simulateSimSwapRisk(phoneNumber);
        break;
      case 'SIMULATE_LOCATION':
        result = await orangeMoneyPlayground.simulateLocation(phoneNumber, data?.lat, data?.lng);
        break;
      default:
        return NextResponse.json({ error: `Action "${action}" non supportée` }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
