import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { getCurrentUser } from '@/services/Auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser();

    return <DashboardShell user={user}>{children}</DashboardShell>;
}
