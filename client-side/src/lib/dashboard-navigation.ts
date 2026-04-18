import type { AuthRole } from '@/types';

import { getAdminsPathByRole, getDashboardPathByRole, getProfilePathByRole } from './auth/roles';

export type DashboardNavigationItem = {
    label: string;
    href: string;
    description: string;
};

export type DashboardRoleConfig = {
    title: string;
    description: string;
    eyebrow: string;
    responsibilities: string[];
    metricsLabel: string;
};

const ROLE_CONFIG: Record<AuthRole, DashboardRoleConfig> = {
    USER: {
        title: 'User dashboard',
        description: 'Track your own orders, payments, and profile updates from one secure place.',
        eyebrow: 'Customer access',
        responsibilities: [
            'View your own orders and payment history',
            'Update your own profile information',
            'Keep tabs on delivery and payment status',
        ],
        metricsLabel: 'Customer activity',
    },
    ADMIN: {
        title: 'Admin dashboard',
        description: 'Manage catalog, orders, payments, and users with backend-backed data.',
        eyebrow: 'Operations access',
        responsibilities: [
            'Manage products, categories, and brands',
            'Monitor orders and payment status',
            'Update your own profile securely',
        ],
        metricsLabel: 'Operational health',
    },
    SUPER_ADMIN: {
        title: 'Super admin dashboard',
        description: 'Full administrative control with everything admins can do plus admin management.',
        eyebrow: 'Platform control',
        responsibilities: [
            'Manage admins and platform access',
            'Handle catalog, orders, payments, and users',
            'Update your own profile securely',
        ],
        metricsLabel: 'Platform health',
    },
};

export function getDashboardRoleConfig(role: AuthRole): DashboardRoleConfig {
    return ROLE_CONFIG[role];
}

export function getDashboardNavigationItems(role: AuthRole): DashboardNavigationItem[] {
    const items: DashboardNavigationItem[] = [
        {
            label: 'Dashboard',
            href: getDashboardPathByRole(role) ?? '/dashboard',
            description: 'Role overview',
        },
        {
            label: 'Profile',
            href: getProfilePathByRole(role) ?? '/my-account',
            description: 'Update profile',
        },
    ];

    if (role === 'SUPER_ADMIN') {
        items.splice(1, 0, {
            label: 'Admins',
            href: getAdminsPathByRole(role) ?? '/dashboard/super-admin/admins',
            description: 'Manage admin accounts',
        });
    }

    return items;
}

export function getRoleShortDescription(role: AuthRole): string {
    return ROLE_CONFIG[role].description;
}
