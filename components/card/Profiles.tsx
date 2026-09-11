import { Profile } from '@/types/profiles';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import Styles from '@/constants/styles';
import { CommonDialog } from '../ui/common-dialog';
import { useProfileMutations } from '@/hooks';
import { updateAuthCredentials } from '@/api/auth.api';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '../ui/toast';

type ProfileFormData = {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    bio: string;
};

function Profiles({
    user,
    onBack,
    showProfileModal,
}: {
    user: Profile;
    showProfileModal: boolean;
    onBack: () => void;
}) {
    const { updateProfile } = useProfileMutations();

    // Ref to the form's submit handler — lets the dialog's confirm button
    // trigger the child form's save without lifting all form state up.
    const submitRef = useRef<(() => Promise<void>) | null>(null);

    const handleConfirm = async () => {
        if (!submitRef.current) return;
        await submitRef.current();
        onBack();
    };

    return (
        <CommonDialog
            open={!!showProfileModal}
            onOpenChange={(open) => {
                if (!open) {
                    onBack();
                }
            }}
            title={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()}
            description="Update your profile here."
            showConfirm={true}
            onConfirm={handleConfirm}
            isLoading={updateProfile.isPending}
            className="min-w-2xl"
        >
            {user && (
                <ProfileForm
                    key={`${user.id}-${showProfileModal}`}
                    user={user}
                    updateProfile={updateProfile}
                    registerSubmit={(fn) => {
                        submitRef.current = fn;
                    }}
                />
            )}
        </CommonDialog>
    );
}

function ProfileForm({
    user,
    updateProfile,
    registerSubmit,
}: {
    user: Profile;
    updateProfile: ReturnType<typeof useProfileMutations>['updateProfile'];
    registerSubmit: (fn: () => Promise<void>) => void;
}) {
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        bio: user.bio ?? '',
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const firstName = user.first_name ?? '';
    const lastName = user.last_name ?? '';

    const fullName =
        `${firstName} ${lastName}`.trim() || 'Unknown User';

    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Register the submit function with the parent so the dialog's
    useEffect(() => {
        const submit = async () => {
            if (!user?.id) return;

            // ─────────────────────────────────────────
            // Password validation + update
            // ─────────────────────────────────────────

            const hasCurrentPassword =
                currentPassword.trim().length > 0;

            const hasNewPassword =
                newPassword.trim().length > 0;

            // Only validate password when user entered
            // something in either password field.
            if (hasCurrentPassword || hasNewPassword) {

                if (!hasCurrentPassword) {
                    toast.add({
                        type: "error",
                        title: "Current password required",
                        description:
                            "Enter your current password to change it.",
                    });

                    return;
                }

                if (!hasNewPassword) {
                    toast.add({
                        type: "error",
                        title: "New password required",
                        description:
                            "Enter a new password.",
                    });

                    return;
                }

                if (newPassword.length < 6) {
                    toast.add({
                        type: "error",
                        title: "Invalid password",
                        description:
                            "New password must be at least 6 characters.",
                    });

                    return;
                }

                if (currentPassword === newPassword) {
                    toast.add({
                        type: "error",
                        title: "Invalid password",
                        description:
                            "New password must be different from your current password.",
                    });

                    return;
                }

                const updatedCredentials =
                    await updateAuthCredentials({
                        email: formData.email,
                        currentPassword,
                        newPassword,
                    });

                if (!updatedCredentials) {
                    toast.add({
                        type: "error",
                        title: "Password update failed",
                        description:
                            "Your current password is incorrect or the password could not be updated.",
                    });

                    return;
                }
            }

            // ─────────────────────────────────────────
            // Update profile
            // ─────────────────────────────────────────

            await updateProfile.mutateAsync({
                id: user.id,
                payload: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    address: formData.address,
                    email: formData.email,
                    city: formData.city,
                    bio: formData.bio,
                },
            });

            // ─────────────────────────────────────────
            // Success
            // ─────────────────────────────────────────

            toast.add({
                type: "success",
                title: "Profile updated",
                description:
                    "Personal information updated successfully.",
            });
        };

        registerSubmit(submit);
    }, [
        formData,
        user?.id,
        updateProfile,
        newPassword,
        currentPassword,
        registerSubmit,
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-row gap-3">
                <button
                    type="button"
                    className="min-w-max group cursor-pointer text-left flex items-center gap-3"
                >
                    <div className="flex">
                        {user.profile_image_url ? (
                            <Image
                                src={user.profile_image_url}
                                width={144}
                                height={144}
                                alt={fullName}
                                className="h-36 w-36 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-green-100 text-3xl font-semibold text-green-600">
                                {initials}
                            </div>
                        )}
                    </div>
                </button>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-row items-center gap-3">
                        <Input
                            name="first_name"
                            placeholder="Your first name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={Styles.input}
                        />

                        <Input
                            name="last_name"
                            placeholder="Your last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={Styles.input}
                        />
                    </div>

                    <Input
                        name="email"
                        placeholder="Email.."
                        value={formData.email}
                        onChange={handleChange}
                        className={Styles.input}
                    />

                    <Input
                        name="phone"
                        placeholder="Phone.."
                        value={formData.phone}
                        onChange={handleChange}
                        className={Styles.input}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="items-center text-center font-serif text-xl py-1 bg-gray-100 rounded-lg">
                    Additional Info
                </h1>

                <div className="flex flex-row gap-3">
                    <Input
                        name="address"
                        placeholder="Address.."
                        value={formData.address}
                        onChange={handleChange}
                        className={Styles.input}
                    />

                    <Input
                        name="city"
                        placeholder="City.."
                        value={formData.city}
                        onChange={handleChange}
                        className={Styles.input}
                    />
                </div>

                <textarea
                    name="bio"
                    rows={4}
                    placeholder="Bio.."
                    className={`${Styles.input} py-2`}
                    value={formData.bio}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-4">
                <h1 className="items-center text-center font-serif text-xl py-1 bg-gray-100 rounded-lg">
                    Credentials
                </h1>

                <div className="flex flex-row gap-3 w-full">
                    <div className="flex-1 relative flex items-center">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={Styles.input}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 relative flex items-center">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={Styles.input}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profiles;