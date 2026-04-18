'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import { submitSignOut, type SignOutState } from '@/app/(withNavFooter)/my-account/actions';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDashboardPathByRole, getProfilePathByRole, getRoleLabel } from '@/lib/auth/roles';
import { UserAvatar } from '@/components/UserAvatar';

type UserDropdownMenuProps = {
    compact?: boolean;
    user?: {
        name: string;
        email: string;
        image?: string | null;
        role: string;
    } | null;
};

export function UserDropdownMenu({ compact = false, user: providedUser }: UserDropdownMenuProps) {
    const router = useRouter();
    const { user: contextUser, setIsLoading, setUser } = useUser();
    const [logoutState, logoutAction, logoutPending] = useActionState<SignOutState, FormData>(
        submitSignOut,
        { ok: false, message: '' },
    );

    useEffect(() => {
        if (!logoutState.ok) {
            return;
        }

        setUser(null);
        setIsLoading(true);
        router.push('/my-account');
    }, [logoutState, router, setIsLoading, setUser]);

    const user = contextUser
        ? {
              ...(providedUser ?? {}),
              ...contextUser,
              image: contextUser.image?.trim() || providedUser?.image || null,
          }
        : providedUser;

    if (!user) {
        return (
            <Button
                asChild
                variant="secondary"
                className={compact ? 'h-10 w-10 rounded-full p-0' : 'rounded-full px-4'}
            >
                <Link href="/my-account" aria-label="My account" className="text-white!">
                    {compact ? '👤' : 'Sign in'}
                </Link>
            </Button>
        );
    }

    const dashboardPath = getDashboardPathByRole(user.role) ?? '/dashboard';
    const profilePath = getProfilePathByRole(user.role) ?? '/my-account';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={compact ? 'h-10 w-10 rounded-full p-0' : 'h-auto rounded-full px-2 py-1.5'}
                >
                    <UserAvatar name={user.name} image={user.image} className="size-8" />
                    {compact ? null : (
                        <div className="ml-2 text-left">
                            <div className="text-sm font-semibold text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</div>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Signed in as
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={dashboardPath}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={profilePath}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logoutAction} className="px-1 py-1">
                    <button
                        type="submit"
                        disabled={logoutPending}
                        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                        {logoutPending ? 'Logging out...' : 'Logout'}
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
