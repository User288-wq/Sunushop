import { NextRequest, NextResponse } from 'next/server';
import { orangeMoneyService } from '@/lib/payment/orange-money-service';

export async function POST(req: NextRequest) {
  try {
    const { action, phoneNumber, amount, description, orderId } = await req.json();

    // Gestion des numéros (playground)
    if (action && ['CREATE', 'DELETE', 'UPDATE'].includes(action)) {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: 'Numéro de téléphone requis' },
          { status: 400 }
        );
      }

      const result = await orangeMoneyService.manageNumber(action, phoneNumber);
      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    // Paiement
    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const result = await orangeMoneyService.initiatePayment({
      amount,
      phoneNumber,
      description: description || `Paiement commande ${orderId}`,
      orderId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authReqId = searchParams.get('authReqId');

    if (!authReqId) {
      return NextResponse.json(
        { error: 'authReqId requis' },
        { status: 400 }
      );
    }

    const result = await orangeMoneyService.checkPaymentStatus(authReqId);

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
