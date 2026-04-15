import { OrdersPageClient } from '@/components/OrdersPageClient';
import { SeoScripts } from '@/components/SeoScripts';
import { ordersMetadata, ordersSchemas } from '@/lib/seo';

export const metadata = ordersMetadata;

export default function OrdersPage() {
  return (
    <>
      <SeoScripts data={ordersSchemas} />
      <OrdersPageClient />
    </>
  );
}
