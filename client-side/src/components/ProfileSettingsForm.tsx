'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { changePassword, updateProfileData } from '@/services/Auth';

export function ProfileSettingsForm({
    profile,
}: {
    profile: { name: string; phone?: string; dob?: string; email: string };
}) {
    const [isPending, startTransition] = useTransition();
    const [profileForm, setProfileForm] = useState({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        dob: profile.dob ? String(profile.dob).slice(0, 10) : '',
    });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your account information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <Input value={profile.email} disabled />
                    <Input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Name" />
                    <Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Phone" />
                    <Input type="date" value={profileForm.dob} onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })} />
                    <Button disabled={isPending} onClick={() => startTransition(async () => {
                        const result = await updateProfileData({
                            name: profileForm.name,
                            phone: profileForm.phone,
                            dob: profileForm.dob,
                        });
                        if (!result?.success) {
                            toast.error(result?.message ?? 'Failed to update profile.');
                            return;
                        }
                        toast.success(result.message ?? 'Profile updated successfully.');
                    })}>Save profile</Button>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>Keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <Input type="password" placeholder="Current password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
                    <Input type="password" placeholder="New password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                    <Button disabled={isPending} onClick={() => startTransition(async () => {
                        const result = await changePassword(passwordForm);
                        if (!result?.success) {
                            toast.error(result?.message ?? 'Failed to change password.');
                            return;
                        }
                        setPasswordForm({ oldPassword: '', newPassword: '' });
                        toast.success(result.message ?? 'Password changed successfully.');
                    })}>Update password</Button>
                </CardContent>
            </Card>
        </div>
    );
}
