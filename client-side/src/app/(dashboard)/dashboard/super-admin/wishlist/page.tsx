import type { Metadata } from 'next';
import {
  DashboardWishlistManager,
  type DashboardWishlistRecord,
} from '@/components/dashboard/DashboardEngagementManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllWishlist } from '@/services/WishlistHistory';

export const metadata: Metadata = buildMetadata({
  title: 'Wishlist Activity',
  description: 'Review backend-saved wishlist activity.',
  path: '/dashboard/super-admin/wishlist',
  noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function SuperAdminWishlistPage() {
  await requireDashboardRoles(['SUPER_ADMIN']);
  const result = await getAllWishlist().catch(() => null);

  return (
    <DashboardWishlistManager
      records={Array.isArray(result?.data) ? (result.data as DashboardWishlistRecord[]) : []}
    />
  );
}
