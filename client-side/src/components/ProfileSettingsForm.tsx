'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { changePassword, updateProfileData, updateProfilePhoto } from '@/services/Auth';
import { useUser } from '@/context/UserContext';
import { UserAvatar } from '@/components/UserAvatar';

export function ProfileSettingsForm({
    profile,
}: {
    profile: { name: string; phone?: string; dob?: string; email: string; image?: string | null };
}) {
    const router = useRouter();
    const { setIsLoading } = useUser();
    const [isPending, startTransition] = useTransition();
    const [profileForm, setProfileForm] = useState({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        dob: profile.dob ? String(profile.dob).slice(0, 10) : '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(profile.image ?? '');
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    function handleImageSelect(file?: File) {
        if (!file) return;

        if (imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function toIsoDate(value: string): string {
        return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : '';
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your account information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/30 p-4">
                        <UserAvatar name={profileForm.name} image={imagePreview} className="size-16" />
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-foreground">Profile photo</div>
                            <div className="text-xs text-muted-foreground">
                                Upload a new photo for your account avatar.
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => imageInputRef.current?.click()}
                                >
                                    Choose image
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isPending || !imageFile}
                                    onClick={() =>
                                        startTransition(async () => {
                                            if (!imageFile) {
                                                toast.error('Profile photo is required.');
                                                return;
                                            }

                                            const formData = new FormData();
                                            formData.append('user', imageFile);

                                            const result = await updateProfilePhoto(formData);
                                            if (!result?.success) {
                                                toast.error(
                                                    result?.message ?? 'Failed to update profile photo.',
                                                );
                                                return;
                                            }

                                            setIsLoading(true);
                                            setImageFile(null);
                                            router.refresh();
                                            toast.success(result.message ?? 'Photo updated successfully.');
                                        })
                                    }
                                >
                                    Update photo
                                </Button>
                            </div>
                        </div>
                    </div>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={event => {
                            handleImageSelect(event.target.files?.[0]);
                            event.currentTarget.value = '';
                        }}
                    />
                    <Input value={profile.email} disabled />
                    <Input
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Name"
                    />
                    <Input
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <Input
                        type="date"
                        value={profileForm.dob}
                        onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                    />
                    <Button
                        disabled={isPending}
                        onClick={() =>
                            startTransition(async () => {
                                const result = await updateProfileData({
                                    name: profileForm.name,
                                    phone: profileForm.phone,
                                    dob: toIsoDate(profileForm.dob),
                                });
                                if (!result?.success) {
                                    toast.error(result?.message ?? 'Failed to update profile.');
                                    return;
                                }
                                setIsLoading(true);
                                router.refresh();
                                toast.success(result.message ?? 'Profile updated successfully.');
                            })
                        }
                    >
                        Save profile
                    </Button>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>Keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <div className="relative">
                        <Input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Current password"
                            autoComplete="current-password"
                            value={passwordForm.oldPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(value => !value)}
                            aria-label={showOldPassword ? 'Hide current password' : 'Show current password'}
                            className="absolute inset-y-0 right-3 inline-flex items-center text-foreground/50 transition hover:text-foreground"
                        >
                            {showOldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="New password"
                            autoComplete="new-password"
                            value={passwordForm.newPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(value => !value)}
                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                            className="absolute inset-y-0 right-3 inline-flex items-center text-foreground/50 transition hover:text-foreground"
                        >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <Button
                        disabled={isPending}
                        onClick={() =>
                            startTransition(async () => {
                                const result = await changePassword({
                                    oldPassword: passwordForm.oldPassword,
                                    newPassword: passwordForm.newPassword,
                                });
                                if (!result?.success) {
                                    toast.error(result?.message ?? 'Failed to change password.');
                                    return;
                                }
                                setIsLoading(true);
                                router.refresh();
                                setPasswordForm({ oldPassword: '', newPassword: '' });
                                toast.success(result.message ?? 'Password changed successfully.');
                            })
                        }
                    >
                        Update password
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
