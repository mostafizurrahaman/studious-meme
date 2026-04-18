'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Tags,
    ReceiptText,
    Users as UsersIcon,
    BadgeCheck,
    Settings,
    ShieldUser,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserDropdownMenu } from '@/components/account/UserDropdownMenu';
import { getRoleLabel, normalizeRole, normalizeRoleSegment } from '@/lib/auth/roles';
import { getDashboardNavigationItems, getDashboardRoleConfig } from '@/lib/dashboard-navigation';
import { cn } from '@/lib/utils';

type DashboardShellProps = {
    children: React.ReactNode;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    } | null;
};

export function DashboardShell({ children, user }: DashboardShellProps) {
    const pathname = usePathname();
    const role = normalizeRole(user?.role) ?? 'USER';
    const roleConfig = getDashboardRoleConfig(role);
    const normalizedRole = normalizeRoleSegment(user?.role) ?? 'user';
    const iconByLabel: Record<string, typeof LayoutDashboard> = {
        Dashboard: LayoutDashboard,
        Admins: ShieldUser,
        Users: UsersIcon,
        Products: ShoppingBag,
        Brands: BadgeCheck,
        Categories: Tags,
        Orders: ReceiptText,
        Payments: ReceiptText,
        Profile: Settings,
    };
    const navItems = getDashboardNavigationItems(role).map(item => ({
        ...item,
        icon: iconByLabel[item.label] ?? LayoutDashboard,
    }));

    return (
        <SidebarProvider defaultOpen>
            <Sidebar
                collapsible="icon"
                variant="inset"
                className="border-r border-sidebar-border/60 bg-linear-to-b from-sidebar via-sidebar to-sidebar-accent/15 shadow-[0_18px_60px_-22px_rgba(0,0,0,0.28)]"
            >
                <SidebarHeader>
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-2xl border border-sidebar-border/60 bg-white/5 p-3 shadow-sm backdrop-blur"
                    >
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/70 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
                            M
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-sidebar-foreground">
                                Malamal Dashboard
                            </p>
                            <p className="truncate text-xs text-sidebar-foreground/70">
                                Storefront control center
                            </p>
                        </div>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.28em] text-sidebar-foreground/55">
                            Main
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map(item => {
                                    const active =
                                        pathname === item.href ||
                                        (item.href !== `/dashboard/${normalizedRole}` &&
                                            pathname.startsWith(`${item.href}/`));

                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                size="lg"
                                                className={cn(
                                                    'relative rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition-all',
                                                    active
                                                        ? 'bg-linear-to-r from-primary via-primary/90 to-primary/75 shadow-xl shadow-primary/25 ring-1 ring-primary/30 before:absolute before:inset-y-3 before:left-1 before:w-1 before:rounded-full before:bg-primary-foreground/90 text-white!'
                                                        : 'border-sidebar-border/0 bg-white/0 text-sidebar-foreground/80 hover:border-sidebar-border/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground',
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <div className="px-1">
                        <UserDropdownMenu
                            user={
                                user
                                    ? {
                                          name: user.name ?? 'Guest',
                                          email: user.email ?? '',
                                          image: user.image?.trim() || null,
                                          role: role,
                                      }
                                    : null
                            }
                        />
                    </div>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="sticky top-0 z-20 border-b border-border/60 bg-background/75 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
                    <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-linear-to-r from-background via-background to-muted/30 px-4 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]">
                        <SidebarTrigger />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                    {roleConfig.eyebrow}
                                </span>
                                <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                    {getRoleLabel(role)}
                                </span>
                            </div>
                            <h1 className="mt-1 truncate text-base font-semibold text-foreground">{`${getRoleLabel(role)} dashboard`}</h1>
                            <p className="truncate text-sm text-muted-foreground">{roleConfig.description}</p>
                        </div>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-6 md:px-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
