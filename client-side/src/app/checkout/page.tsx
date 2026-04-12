import { CheckoutPageClient } from '@/components/CheckoutPageClient';
import { checkoutMetadata } from '@/lib/seo';

export const metadata = checkoutMetadata;

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
