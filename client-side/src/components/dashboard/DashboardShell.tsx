'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Boxes, LayoutDashboard, LogOut, MessageSquare, Package, ReceiptText, Settings, ShieldUser, Tags, WandSparkles } from 'lucide-react';

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
import { submitSignOut } from '@/app/(withNavFooter)/my-account/actions';
import { getDashboardPath } from '@/lib/dashboard';

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
    const initials = user?.name
        ? user.name
              .split(' ')
              .map(part => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'M';

    const role = user?.role ?? 'USER';
    const navItems =
        role === 'USER'
            ? [
                  { href: getDashboardPath(role), label: 'Orders', icon: LayoutDashboard },
                  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
              ]
            : [
                  { href: getDashboardPath(role), label: 'Overview', icon: LayoutDashboard },
                  { href: '/dashboard/orders', label: 'Orders', icon: ReceiptText },
                  { href: '/dashboard/payments', label: 'Payments', icon: ReceiptText },
                  { href: '/dashboard/products', label: 'Products', icon: Package },
                  { href: '/dashboard/categories', label: 'Categories', icon: Tags },
                  { href: '/dashboard/brands', label: 'Brands', icon: Boxes },
                  { href: '/dashboard/hero', label: 'Hero section', icon: WandSparkles },
                  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
                  { href: '/dashboard/comparisons', label: 'Comparisons', icon: BarChart3 },
                  ...(role === 'SUPER_ADMIN'
                      ? [{ href: '/dashboard/admins', label: 'Admins', icon: ShieldUser }]
                      : []),
                  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
              ];

    return (
        <SidebarProvider defaultOpen>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                            M
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-sidebar-foreground">Malamal Dashboard</p>
                            <p className="truncate text-xs text-sidebar-foreground/70">Storefront control center</p>
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
                                        <SidebarMenuButton asChild isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-2 py-2">
                                <Avatar className="size-9">
                                    <AvatarImage src={user?.image ?? ''} alt={user?.name ?? 'User'} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-sm font-semibold text-sidebar-foreground">{user?.name ?? 'Guest'}</p>
                                    <p className="truncate text-xs text-sidebar-foreground/70">{user?.role ?? 'Administrator'}</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/my-account">My account</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                                <form action={submitSignOut}>
                                    <button type="submit" className="flex w-full items-center">
                                        <LogOut className="mr-2 size-4" />
                                        Sign out
                                    </button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
                    <SidebarTrigger />
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-base font-semibold text-foreground">{role.toLowerCase()} dashboard</h1>
                        <p className="truncate text-sm text-muted-foreground">{role === 'USER' ? 'Track orders and payment progress.' : role === 'SUPER_ADMIN' ? 'Control admins, catalog, content and support.' : 'Manage catalog, content and support requests.'}</p>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-6 md:px-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
