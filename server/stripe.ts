import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[Stripe] STRIPE_SECRET_KEY not configured');
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    });
  }

  return stripeInstance;
}

export async function createCheckoutSession(params: {
  categoryName: string;
  priceInCents: number;
  registrationId: number;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ sessionId: string; url: string } | null> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.categoryName,
              description: 'Race Registration',
            },
            unit_amount: params.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        registrationId: params.registrationId.toString(),
      },
    });

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw error;
  }
}

export async function verifyPayment(sessionId: string): Promise<{
  paid: boolean;
  registrationId?: number;
}> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return {
      paid: session.payment_status === 'paid',
      registrationId: session.metadata?.registrationId 
        ? Number(session.metadata.registrationId) 
        : undefined,
    };
  } catch (error) {
    console.error('[Stripe] Failed to verify payment:', error);
    throw error;
  }
}

