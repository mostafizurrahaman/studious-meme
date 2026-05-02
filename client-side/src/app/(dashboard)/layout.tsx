import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireDashboardUser } from '@/lib/dashboard-auth';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDashboardUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
