import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Price IDs mapping
const PRICE_IDS = {
  basic: 'price_1SBiE0JutzSMwE36zYk3pzZ9', // €9/month user plan
  pro: 'price_1QH0yVJutzSMwE36iVn2X3mR',   // €39/month pro plan
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode, plan, user } = req.body;

    console.log('Checkout request:', { mode, plan, user: { id: user?.id, email: user?.email } });

    // Validate input
    if (mode !== 'new') {
      return res.status(400).json({ error: 'Solo mode "new" supportato' });
    }

    if (!plan || !PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return res.status(400).json({ error: 'Piano non valido' });
    }

    if (!user?.id || !user?.email) {
      return res.status(400).json({ error: 'Per un nuovo utente servono user.id ed email' });
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

    // Create new customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });

    console.log('Created customer:', customer.id);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,

      client_reference_id: user.id,
      metadata: { userId: user.id, plan },
      subscription_data: { metadata: { userId: user.id, plan } },

      success_url: `${req.headers.origin || 'http://localhost:3000'}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/#prezzi?canceled=1`,
    });

    console.log('Created session:', session.id);

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Errore interno del server' 
    });
  }
}