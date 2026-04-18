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
import { getRoleLabel, normalizeRole } from '@/lib/auth/roles';
import { getDashboardNavigationItems, getDashboardRoleConfig } from '@/lib/dashboard-navigation';

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
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
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
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Main</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map(item => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={
                                                pathname === item.href || pathname.startsWith(`${item.href}/`)
                                            }
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
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
                                          image: user.image ?? '',
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
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
                    <SidebarTrigger />
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-base font-semibold text-foreground">{`${getRoleLabel(role)} dashboard`}</h1>
                        <p className="truncate text-sm text-muted-foreground">{roleConfig.description}</p>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-6 md:px-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
