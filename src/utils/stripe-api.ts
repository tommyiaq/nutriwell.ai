import { User } from './api';

// Stripe plan configuration
export const STRIPE_PLANS = {
  user: {
    priceId: 'price_1QH0y6JutzSMwE36Bt7qU0KG', // €9/month user plan
    planName: 'basic',
    amount: 9,
    currency: 'eur',
    interval: 'month'
  },
  pro: {
    priceId: 'price_1QH0yVJutzSMwE36iVn2X3mR', // €39/month pro plan
    planName: 'pro',
    amount: 39,
    currency: 'eur',
    interval: 'month'
  }
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;

/**
 * Create Stripe checkout using client-side approach
 * This mimics the server-side logic but works in browser
 */
export async function createStripeCheckout(
  planId: StripePlan,
  user: User
): Promise<{ url?: string; error?: string }> {
  try {
    console.log('Creating Stripe checkout for:', { planId, user: { id: user.id, email: user.mail } });

    // Map our plan names to match the subscription logic
    const planName = planId === 'user' ? 'basic' : 'pro';

    // Prepare the request body matching the working subscription API
    const requestBody = {
      mode: "new",
      plan: planName,
      user: {
        id: user.id,
        email: user.mail
      }
    };

    // Make API call to create checkout session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Errore HTTP ${response.status}: ${errorData}`);
    }

    const { url, error } = await response.json();
    
    if (error) {
      throw new Error(error);
    }

    console.log('Created checkout session URL:', url);
    return { url };

  } catch (error) {
    console.error('Stripe error details:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return { 
      error: error instanceof Error ? error.message : 'Errore creazione Checkout' 
    };
  }
}

/**
 * Redirect to Stripe checkout
 */
export async function redirectToStripeCheckout(
  planId: StripePlan,
  user: User
): Promise<void> {
  try {
    const result = await createStripeCheckout(planId, user);
    
    if (result.url) {
      console.log('Redirecting to:', result.url);
      window.location.href = result.url;
    } else {
      throw new Error(result.error || 'Failed to create checkout');
    }
  } catch (error) {
    console.error('Redirect error:', error);
    throw error;
  }
}

/**
 * Get plan details by plan ID
 */
export function getPlanDetails(planId: StripePlan) {
  return STRIPE_PLANS[planId];
}

/**
 * Validate if a plan ID is valid
 */
export function isValidPlan(planId: string): planId is StripePlan {
  return planId in STRIPE_PLANS;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Get Stripe checkout session status
 */
export interface StripeSessionStatus {
  status: string;
  payment_status: string;
  cancel_at_period_end?: boolean;
  current_period_end?: number;
  subscription_id?: string;
  customer_id?: string;
  plan_id?: number | null;
  price_id?: string;
  metadata?: any;
}

export async function getCheckoutSessionStatus(
  sessionId: string
): Promise<StripeSessionStatus | { error: string }> {
  try {
    const response = await fetch(`/api/stripe/status?session_id=${sessionId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get session status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting checkout session status:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to get session status' 
    };
  }
}

/**
 * Notify backend about service plan purchase
 */
export async function notifyServicePlanPurchased(
  planId: number,
  stripeCustomerId: string
): Promise<{ status: 'ok' | 'error'; data?: any; error?: string }> {
  try {
    const API_BASE_URL = 'http://10.101.29.182';
    
    const response = await fetch(`${API_BASE_URL}/Services/ServicePlanPurchased.srv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        planId,
        stripeCustomerId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error notifying service plan purchase:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to notify purchase'
    };
  }
}