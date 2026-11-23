export type CheckoutLine = { id: string; quantity: number };

export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
export const stripeCheckoutEnabled = import.meta.env.VITE_STRIPE_ENABLED === 'true';

/** The server must create the Checkout Session and return its hosted URL. */
export async function createStripeCheckoutSession(items: CheckoutLine[]): Promise<{ url: string }> {
  if (!stripePublishableKey) throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is not configured.');
  const response = await fetch('/api/checkout/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error(`Checkout API returned ${response.status}.`);
  const result: unknown = await response.json();
  if (typeof result !== 'object' || result === null || !('url' in result)
      || typeof result.url !== 'string' || !result.url.startsWith('https://')) {
    throw new Error('Checkout API returned an invalid session URL.');
  }
  return { url: result.url };
}
