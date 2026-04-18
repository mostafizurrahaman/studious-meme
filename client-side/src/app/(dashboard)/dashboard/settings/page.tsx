import type { Metadata } from 'next';

import { ProfileSettingsForm } from '@/components/ProfileSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireDashboardUser } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { fetchProfile } from '@/services/Auth';

export const metadata: Metadata = buildMetadata({
    title: 'Settings',
    description: 'Dashboard session and environment settings.',
    path: '/dashboard/settings',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardSettingsPage() {
    const user = await requireDashboardUser();
    const profileResult = await fetchProfile().catch(() => null);
    const profile = profileResult?.data ?? user;

    return (
        <div className="grid gap-4">
            <ProfileSettingsForm
                profile={{ name: profile.name, email: profile.email, phone: profile.phone, dob: profile.dob }}
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Session</CardTitle>
                    <CardDescription>Current authenticated dashboard user.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <span className="font-semibold">Name:</span> {user?.name ?? 'Guest'}
                    </div>
                    <div>
                        <span className="font-semibold">Email:</span> {user?.email ?? 'Not signed in'}
                    </div>
                    <div>
                        <span className="font-semibold">Role:</span> {user?.role ?? 'Unknown'}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Environment</CardTitle>
                    <CardDescription>Client API config in use.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <span className="font-semibold">API URL:</span>{' '}
                        {process.env.NEXT_PUBLIC_API_URL ?? 'unset'}
                    </div>
                    <div>
                        <span className="font-semibold">App URL:</span>{' '}
                        {process.env.NEXT_PUBLIC_APP_URL ?? 'unset'}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
