import type { Metadata } from 'next';
import {
  DashboardComparisonManager,
  type DashboardComparisonRecord,
} from '@/components/dashboard/DashboardEngagementManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllComparisonHistory } from '@/services/ComparisonHistory';

export const metadata: Metadata = buildMetadata({
  title: 'Comparison History',
  description: 'Review backend-saved product comparison history.',
  path: '/dashboard/super-admin/compare',
  noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function SuperAdminComparePage() {
  await requireDashboardRoles(['SUPER_ADMIN']);
  const result = await getAllComparisonHistory().catch(() => null);

  return (
    <DashboardComparisonManager
      records={Array.isArray(result?.data) ? (result.data as DashboardComparisonRecord[]) : []}
    />
  );
}
