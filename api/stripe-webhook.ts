import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2024-06-20' });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const signature = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  try {
    const event = stripe.webhooks.constructEvent(req.body, signature, secret);

    if (event.type === 'checkout.session.completed') {
      // TODO: actualizar user_profiles.subscription_tier='premium' en Supabase usando metadata del customer.
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).send('Webhook error');
  }
}
