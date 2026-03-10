import type { ReactNode } from 'react';

// Wrapper simple para dejar preparado el wiring de Stripe Elements a futuro.
function StripeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default StripeProvider;
