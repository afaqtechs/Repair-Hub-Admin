"use client";

import React, { useState } from "react";

import {
    userColumns,
} from "./component/columns";

import { DataTable } from "@/components/ui/datatable";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { PageHeader } from "@/components/ui/page-header";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Profile } from "@/types/profiles";
import {
    useTechnicians,
    useProfileMutations,
} from "@/hooks";

function Users() {
    const [selectedUser, setSelectedUser] =
        useState<Profile | null>(null);

    const [showStatusModal, setShowStatusModal] =
        useState<Profile | null>(null);

    const { data: technicians = [], isLoading } =
        useTechnicians();

    const { updateProfile } =
        useProfileMutations();

    const adminUsers = technicians.filter(
        (user) => user.role === "admin"
    );

    const technicianUsers = technicians.filter(
        (user) => user.role === "technician"
    );

    const handleSelect = (user: Profile) => {
        setSelectedUser(user);
    };

    // Active / inactive
    const handleActiveChange = (
        user: Profile,
        checked: boolean
    ) => {
        updateProfile.mutate({
            id: user.id,
            payload: {
                is_active: checked,
            },
        });
    };

    // Open verification modal
    const handleVerificationChange = (user: Profile) => {
        setShowStatusModal(user);
    };

    // Verify / reject
    const handleVerificationUpdate = (
        status: Profile["verification_status"]
    ) => {
        if (!showStatusModal) return;

        updateProfile.mutate(
            {
                id: showStatusModal.id,
                payload: {
                    verification_status: status,
                },
            },
            {
                onSuccess: () => {
                    setShowStatusModal(null);
                },
            }
        );
    };

    type VerificationStatus =
        NonNullable<Profile["verification_status"]>;

    const verificationOptions: Record<
        VerificationStatus,
        {
            value: Profile["verification_status"];
            label: string;
        }[]
    > = {
        pending: [
            {
                value: "verified",
                label: "Verify",
            },
            {
                value: "rejected",
                label: "Reject",
            },
        ],

        verified: [
            {
                value: "pending",
                label: "Pending",
            },
            {
                value: "rejected",
                label: "Reject",
            },
        ],

        rejected: [
            {
                value: "verified",
                label: "Verify",
            },
            {
                value: "pending",
                label: "Pending",
            },
        ],
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Users"
                description="Manage Addis repair administrators and technicians."
            />

            {/* Administrators */}
            <div className="space-y-3">
                <h2 className="font-stretch-semi-expanded text-lg font-semibold text-gray-900">
                    Administrators
                </h2>

                <div className="space-y-4 rounded-lg bg-card p-6">
                    <DataTableToolbar
                        searchPlaceholder="Search categories..."
                        className="w-full lg:w-1/2"
                    />

                    <DataTable
                        columns={userColumns(
                            handleSelect,
                            handleVerificationChange,
                            handleActiveChange
                        )}
                        data={adminUsers}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Technicians */}
            <div className="space-y-3">
                <h2 className="font-stretch-semi-expanded text-lg font-semibold text-gray-900">
                    Technicians
                </h2>

                <div className="space-y-4 rounded-lg bg-card p-6">
                    <DataTableToolbar
                        searchPlaceholder="Search technicians..."
                        className="w-full lg:w-1/2"
                    />

                    <DataTable
                        columns={userColumns(
                            handleSelect,
                            handleVerificationChange,
                            handleActiveChange
                        )}
                        data={technicianUsers}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Verification Modal */}
            <Dialog
                open={!!showStatusModal}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowStatusModal(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Update Verification Status
                        </DialogTitle>

                        <DialogDescription>
                            Choose the verification status for{" "}
                            <span className="font-medium text-gray-900">
                                {showStatusModal?.first_name}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-3 py-4">
                        {showStatusModal &&
                            verificationOptions[showStatusModal.verification_status ?? "pending"].map(
                                (option) => (
                                    <Button
                                        key={option.value}
                                        variant={
                                            option.value === "rejected"
                                                ? "destructive"
                                                : option.value === "pending"
                                                    ? "secondary" : "primary"
                                        }
                                        className="flex-1"
                                        disabled={updateProfile.isPending}
                                        onClick={() =>
                                            handleVerificationUpdate(
                                                option.value
                                            )
                                        }
                                    >
                                        {option.label}
                                    </Button>
                                )
                            )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="default"
                            onClick={() =>
                                setShowStatusModal(null)
                            }
                            disabled={
                                updateProfile.isPending
                            }
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Users;