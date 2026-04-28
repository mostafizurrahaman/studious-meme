import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardDate } from "@/lib/formatDate";
import { requireRoleSegment } from "@/lib/dashboard-auth";
import { buildMetadata } from "@/lib/seo";
import { getMyPayments, type BackendPayment } from "@/services/Payment";

export const metadata: Metadata = buildMetadata({
  title: "Payments",
  description: "Review your payment history.",
  path: "/dashboard/user/payments",
  noindex: true,
});

export const dynamic = "force-dynamic";

export default async function UserPaymentsPage() {
  await requireRoleSegment("user");
  const paymentsResult = await getMyPayments().catch(() => null);
  const payments = Array.isArray(paymentsResult?.data)
    ? (paymentsResult.data as BackendPayment[])
    : [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tran ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : null}
            {payments.map((item) => {
              const orderId =
                typeof item.order === "object"
                  ? item.order.orderId
                  : item.order;
              return (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {item.transactionId}
                  </TableCell>
                  <TableCell>{orderId}</TableCell>
                  <TableCell>৳ {item.amount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <span
                      title={formatDashboardDate(item.createdAt, {
                        time: true,
                      })}
                    >
                      {formatDashboardDate(item.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
