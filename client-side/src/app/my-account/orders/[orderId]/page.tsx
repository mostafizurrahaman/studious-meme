import { OrderDetailClient } from '@/components/OrderDetailClient';

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  return <OrderDetailClient orderId={orderId} />;
}
