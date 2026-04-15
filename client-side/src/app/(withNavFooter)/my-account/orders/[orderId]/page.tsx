import { OrderDetailClient } from '@/components/OrderDetailClient';
import { SeoScripts } from '@/components/SeoScripts';
import { orderDetailMetadata } from '@/lib/seo';
import { buildOrderDetailSchemas } from '@/lib/seo';

export const metadata = orderDetailMetadata;

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  return (
    <>
      <SeoScripts data={buildOrderDetailSchemas(orderId)} />
      <OrderDetailClient orderId={orderId} />
    </>
  );
}
