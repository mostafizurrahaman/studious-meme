import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDashboardDate } from '@/lib/formatDate';
import type { BackendOrder } from '@/services/Order';

export function DashboardOrdersManager({
  orders,
  title,
  description,
  detailBaseHref,
  updateStatus,
  paginationMeta,
  listBaseHref,
}: {
  orders: BackendOrder[];
  title: string;
  description: string;
  detailBaseHref: string;
  updateStatus: (formData: FormData) => Promise<void>;
  paginationMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  listBaseHref: string;
}) {
  const pageHref = (page: number, limit = paginationMeta.limit) =>
    `${listBaseHref}?page=${page}&limit=${limit}`;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {orders.length} of {paginationMeta.total} orders
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Coupon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.orderId}>
                <TableCell>
                  <Link href={`${detailBaseHref}/${order.orderId}`} className="font-medium hover:underline">
                    {order.orderId}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    <span
                      className="cursor-help"
                      title={formatDashboardDate(order.createdAt, {
                        time: true,
                      })}
                    >
                      {formatDashboardDate(order.createdAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                </TableCell>
                <TableCell>
                  {order.couponCode ? (
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {order.couponCode}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No coupon</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <div>{order.paymentMethod}</div>
                  <div className="text-xs text-muted-foreground">{order.paymentStatus}</div>
                </TableCell>
                <TableCell>৳ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="cursor-help" title={formatDashboardDate(order.createdAt, { time: true })}>
                    {formatDashboardDate(order.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="cursor-help" title={formatDashboardDate(order.updatedAt, { time: true })}>
                    {formatDashboardDate(order.updatedAt)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <form action={updateStatus} className="flex justify-end gap-2">
                    <input type="hidden" name="orderId" value={order.orderId} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {['PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button size="sm" type="submit">
                      Update
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        {paginationMeta.total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Page {paginationMeta.page} of {paginationMeta.totalPages}
              </span>
              {[25, 50, 100].map(limit => (
                <Link
                  key={limit}
                  href={pageHref(1, limit)}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    paginationMeta.limit === limit ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {limit}
                </Link>
              ))}
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" disabled={paginationMeta.page <= 1}>
                <Link href={pageHref(Math.max(1, paginationMeta.page - 1))}>Prev</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={paginationMeta.page >= paginationMeta.totalPages}
              >
                <Link href={pageHref(Math.min(paginationMeta.totalPages, paginationMeta.page + 1))}>
                  Next
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
