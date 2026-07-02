import axios from 'axios';

export interface InitPaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  description: string;
  returnUrl: string;
  notifyUrl: string;
}

export async function initWavePayment(params: InitPaymentParams) {
  const { amount, currency, orderId, customerPhone, returnUrl, notifyUrl } = params;
  const amountInSmallestUnit = amount * 100;
  try {
    const response = await axios.post(
      'https://api.wave.com/v1/checkout/sessions',
      {
        amount: amountInSmallestUnit.toString(),
        currency,
        client_reference: orderId,
        success_url: returnUrl,
        error_url: returnUrl,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, paymentUrl: response.data.url, sessionId: response.data.id };
  } catch (error) {
    console.error("Wave payment init error:", error);
    return { success: false, error: "Erreur d'initialisation Wave" };
  }
}

export async function initCinetPayPayment(params: InitPaymentParams) {
  const { amount, currency, orderId, customerPhone, customerEmail, customerName, description, returnUrl, notifyUrl } = params;
  const amountInt = Math.floor(amount);
  try {
    const response = await axios.post(
      'https://api-checkout.cinetpay.com/v2/payment',
      {
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: orderId,
        amount: amountInt,
        currency,
        description,
        notify_url: notifyUrl,
        return_url: returnUrl,
        channels: 'MOBILE_MONEY',
        lang: 'fr',
        metadata: `commande_${orderId}`,
        customer_phone_number: customerPhone,
        customer_email: customerEmail,
        customer_name: customerName,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data && response.data.data && response.data.data.payment_url) {
      return { success: true, paymentUrl: response.data.data.payment_url, sessionId: response.data.data.transaction_id };
    } else {
      console.error("CinetPay init error:", response.data);
      return { success: false, error: response.data?.message || "Erreur CinetPay" };
    }
  } catch (error) {
    console.error("CinetPay payment init error:", error);
    return { success: false, error: "Erreur d'initialisation CinetPay" };
  }
}
