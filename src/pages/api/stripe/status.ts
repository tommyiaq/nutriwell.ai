import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'session_id is required' });
    }

    // Retrieve the checkout session with subscription details
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'subscription.items.data.price', 'customer'],
    });

    console.log('Checkout session retrieved:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer: session.customer,
      subscription: session.subscription
    });

    // Extract subscription details
    const subscription = session.subscription && typeof session.subscription !== 'string' 
      ? session.subscription 
      : null;

    if (!subscription) {
      return res.status(200).json({
        status: 'none',
        payment_status: session.payment_status,
        customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      });
    }

    // Get the price information to determine the plan
    const item = subscription.items.data[0];
    const priceId = item?.price?.id;

    // Map price IDs to plan IDs (2 for user/basic, 3 for pro)
    let planId = null;
    if (priceId === 'price_1SBiE0JutzSMwE36zYk3pzZ9') {
      planId = 2; // user/basic plan
    } else if (priceId === 'price_1SBig9JutzSMwE36uz3QEFvf') {
      planId = 3; // pro plan
    }

    return res.status(200).json({
      status: subscription.status,
      payment_status: session.payment_status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: (subscription as any).current_period_end,
      subscription_id: subscription.id,
      customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      plan_id: planId,
      price_id: priceId,
      metadata: session.metadata,
    });

  } catch (error) {
    console.error('Stripe status error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
