import { OrdersPageClient } from "@/components/OrdersPageClient";
import { SeoScripts } from "@/components/SeoScripts";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getMyOrders } from "@/services/Order";

export const metadata = buildMetadata({
  title: "Orders",
  description: "View saved orders from this dashboard account.",
  path: "/dashboard/user/orders",
  noindex: true,
});

export const dynamic = "force-dynamic";

export default async function UserOrdersPage() {
  const ordersResult = await getMyOrders().catch(() => null);
  const orders = Array.isArray(ordersResult?.data) ? ordersResult.data : [];

  return (
    <>
      <SeoScripts
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Dashboard", url: "/dashboard/user" },
            { name: "Orders", url: "/dashboard/user/orders" },
          ]),
        ]}
      />
      <OrdersPageClient orders={orders} baseHref="/dashboard/user" />
    </>
  );
}
