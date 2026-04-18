'use client';

import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import { submitSignOut } from '@/app/(withNavFooter)/my-account/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type UserDropdownMenuProps = {
    compact?: boolean;
    user?: {
        name: string;
        email: string;
        image: string;
        role: string;
    } | null;
};

function getInitials(name?: string | null): string {
    if (!name) return 'U';

    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function UserDropdownMenu({ compact = false, user: providedUser }: UserDropdownMenuProps) {
    const { user: contextUser } = useUser();
    const user = providedUser ?? contextUser;

    if (!user) {
        return (
            <Button
                asChild
                variant="secondary"
                className={compact ? 'h-10 w-10 rounded-full p-0' : 'rounded-full px-4'}
            >
                <Link href="/my-account" aria-label="My account">
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
                    <Avatar className="size-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
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
                <form action={submitSignOut} className="px-1 py-1">
                    <button
                        type="submit"
                        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10"
                    >
                        Logout
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
