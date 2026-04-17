export type DashboardRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export const getDashboardRoleSegment = (role: string) => role.toLowerCase();

export const getDashboardPath = (role: string) => `/dashboard/${getDashboardRoleSegment(role)}`;

export const isRoleSegmentMatch = (role: string, segment: string) => getDashboardRoleSegment(role) === segment;
