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
import TechnicianDetail from './component/technicianDetail';
import {
    useTechnicians,
    useProfileMutations,
    usePartByTechnician,
    useServicesByTechnician,
    useRequestsByTechnician,
} from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";
import { FilterConfig } from "@/components/ui/filter-dropdown";
import { RefreshCw } from "lucide-react";

const userFilters: FilterConfig[] = [
    {
        key: "verification",
        label: "Verification",
        countable: true,
        options: [
            {
                label: "All",
                value: "all",
            },
            {
                label: "Pending",
                value: "pending",
            },
            {
                label: "Verified",
                value: "verified",
            },
            {
                label: "Rejected",
                value: "rejected",
            },
        ],
    },

    {
        key: "document",
        label: "Legal Document",
        countable: true,
        options: [
            {
                label: "All",
                value: "all",
            },
            {
                label: "Submitted",
                value: "submitted",
            },
            {
                label: "Not submitted",
                value: "not-submitted",
            },
        ],
    },

    {
        key: "status",
        label: "Status",
        countable: true,
        options: [
            {
                label: "All",
                value: "all",
            },
            {
                label: "Active",
                value: "active",
            },
            {
                label: "Inactive",
                value: "inactive",
            },
        ],
    },
];

function Users() {
    const searchParams = useSearchParams();

    const technicianId = searchParams.get("technicianId");

    const [adminSearch, setAdminSearch] = useState("");
    const [technicianSearch, setTechnicianSearch] = useState("");

    const defaultUserFilters = {
        verification: "all",
        document: "all",
        status: "all",
    };

    const [filters, setFilters] =
        useState(defaultUserFilters);

    const [showStatusModal, setShowStatusModal] =
        useState<Profile | null>(null);

    const { data: technicians = [], isLoading, refetch: refetchUser, isRefetching: refreshing } =
        useTechnicians();

    const { updateProfile } =
        useProfileMutations();

    const filterUsers = (
        users: Profile[],
        search: string
    ) => {
        const query = search.trim().toLowerCase();

        const result = users.filter((user) => {
            // -------------------------
            // Search
            // -------------------------

            if (query) {
                const searchableText = [
                    user.first_name,
                    user.last_name,
                    `${user.first_name ?? ""} ${user.last_name ?? ""}`,
                    user.email,
                    user.phone,
                    user.city,
                    user.address,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!searchableText.includes(query)) {
                    return false;
                }
            }

            // -------------------------
            // Verification
            // -------------------------

            if (
                filters.verification !== "all" &&
                user.verification_status !==
                filters.verification
            ) {
                return false;
            }

            // -------------------------
            // Legal document
            // -------------------------

            const hasDocument =
                !!user.legal_document_url?.trim();

            if (
                filters.document === "submitted" &&
                !hasDocument
            ) {
                return false;
            }

            if (
                filters.document === "not-submitted" &&
                hasDocument
            ) {
                return false;
            }

            // -------------------------
            // Active / inactive
            // -------------------------

            if (
                filters.status === "active" &&
                user.is_active !== true
            ) {
                return false;
            }

            if (
                filters.status === "inactive" &&
                user.is_active !== false
            ) {
                return false;
            }

            return true;
        });

        return result;
    };

    const adminUsers = filterUsers(
        technicians.filter(
            (user) => user.role === "admin"
        ),
        adminSearch
    );

    const technicianUsers = filterUsers(
        technicians.filter(
            (user) => user.role === "technician"
        ),
        technicianSearch
    );

    const selectedFromList = technicians?.find(
        (technician) => technician.id === technicianId
    );

    const [selectedUser, setSelectedUser] =
        useState<Profile | null>(selectedFromList || null);

    const {
        data: parts,
        isLoading: loadingPart,
    } = usePartByTechnician(String(selectedUser?.id));

    const {
        data: services,
        isLoading: loadingService,
    } = useServicesByTechnician(String(selectedUser?.id));

    const {
        data: requests,
        isLoading: loadingRequest,
    } = useRequestsByTechnician(String(selectedUser?.id));

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
        }, {
            onSuccess: (success) => {
                if (!success) {
                    toast.add({
                        type: "error",
                        title: "Update Failed",
                        description:
                            "Failed to update status.",
                    });

                    return;
                }

                toast.add({
                    type: "success",
                    title: "Status updated",
                    description:
                        "Status updated successfully.",
                });
            },
        });
    };

    const handleBack = () => {
        setSelectedUser(null);
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

    const loading = loadingPart || loadingService || loadingRequest;

    if (selectedUser) {
        return (
            <TechnicianDetail
                technician={selectedUser}
                parts={parts}
                services={services}
                requests={requests}
                onBack={handleBack}
                isLoading={loading}
            />
        );
    }

    return (

        <div className="space-y-8">
            <PageHeader
                title="Users"
                description="Manage Addis repair administrators and technicians."
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            onClick={() =>
                                refetchUser()
                            }
                        >
                            <span className={`${refreshing ? "animate-spin" : ""}`}>
                                <RefreshCw size={18} color="#2563EB" />
                            </span>
                        </Button>
                    </div>
                }
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
                        searchValue={adminSearch}
                        onSearchChange={setAdminSearch}
                        showDownload={false}
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
                        searchValue={technicianSearch}
                        onSearchChange={setTechnicianSearch}
                        showDownload={false}
                        filters={userFilters}
                        filterValues={filters}

                        onFilterChange={(key, value) => {
                            setFilters((prev) => ({
                                ...prev,
                                [key]: value,
                            }));
                        }}

                        onResetFilters={() => {
                            setFilters(defaultUserFilters);
                        }}
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