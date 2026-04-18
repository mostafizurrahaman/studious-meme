import { CartPageClient } from '@/components/CartPageClient';
import { cartMetadata } from '@/lib/seo';

export const metadata = cartMetadata;

export default function CartPage() {
    return <CartPageClient />;
}
