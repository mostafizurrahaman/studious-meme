import { OrdersPageClient } from '@/components/OrdersPageClient';
import { SeoScripts } from '@/components/SeoScripts';
import { ordersMetadata, ordersSchemas } from '@/lib/seo';
import { getMyOrders } from '@/services/Order';

export const metadata = ordersMetadata;

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const ordersResult = await getMyOrders().catch(() => null);
    const orders = Array.isArray(ordersResult?.data) ? ordersResult.data : [];

    return (
        <>
            <SeoScripts data={ordersSchemas} />
            <OrdersPageClient orders={orders} />
        </>
    );
}
