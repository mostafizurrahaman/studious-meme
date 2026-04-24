import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserAvatar';
import { getCurrentUser } from '@/services/Auth';
import { ProfileSettingsForm } from '@/components/ProfileSettingsForm';
import { myProfileMetadata } from '@/lib/seo';

export const metadata = myProfileMetadata;

type Props = Record<string, unknown>;

export default async function ProfilePage({}: Props) {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <main className="flex-1 bg-background pb-16">
        <div className="px-4 py-6 lg:px-6">
                    <Card className="p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                            Sign in required
                        </p>
                        <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">My Profile</h1>
                        <p className="mt-3 text-sm text-foreground/65">
                            Please sign in to view and manage your profile.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/my-account">Sign In</Link>
                        </Button>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-background pb-16">
        <div className="px-4 py-6 lg:px-6">
                <Card className="p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Account</p>
                    <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">My Profile</h1>
                    <p className="mt-3 text-sm text-foreground/65">
                        Manage your account information and settings.
                    </p>
                </Card>

                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Card className="p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <UserAvatar name={user.name} image={user.image} className="size-16" />
                            <div>
                                <h2 className="text-xl font-bold text-secondary">Account Details</h2>
                                <p className="text-sm text-foreground/65">Your current profile information.</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="rounded-lg bg-muted p-3">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Name
                                </div>
                                <div className="font-medium">{user.name}</div>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Email
                                </div>
                                <div className="font-medium">{user.email}</div>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Role
                                </div>
                                <div className="font-medium">{user.role}</div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button asChild>
                                <Link href="/my-account/orders">View Orders</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/my-account">My Account</Link>
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-sm">
                        <ProfileSettingsForm
                            key={`${user.name}-${user.email}-${user.phone ?? ''}-${user.dob ?? ''}-${user.image ?? ''}`}
                            profile={{
                                name: user.name,
                                phone: user.phone ?? '',
                                dob: user.dob ?? '',
                                email: user.email,
                                image: user.image,
                            }}
                        />
                    </Card>
                </section>
            </div>
        </main>
    );
}
