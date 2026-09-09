"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Image from "next/image";

import { type DataTableFeatures } from "@/components/ui/data-table-features";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Profile } from "@/types/profiles";

const columnHelper =
    createColumnHelper<DataTableFeatures, Profile>();

type VerificationStatus =
    NonNullable<Profile["verification_status"]>;

const statusConfig: Record<
    VerificationStatus,
    {
        bg: string;
        text: string;
        label: string;
    }
> = {
    verified: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Verified",
    },

    pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
    },

    rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected",
    },
};

export const userColumns = (
    onSelect: (user: Profile) => void,
    onVerificationChange: (user: Profile) => void,
    onActiveChange: (
        user: Profile,
        checked: boolean
    ) => void,
) =>
    columnHelper.columns([
        columnHelper.accessor("first_name", {
            header: "User",

            cell: ({ row }) => {
                const user = row.original;

                const firstName = user.first_name ?? "";
                const lastName = user.last_name ?? "";

                const fullName =
                    `${firstName} ${lastName}`.trim() ||
                    "Unknown User";

                const initials = fullName
                    .split(" ")
                    .filter(Boolean)
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex">
                            {user.profile_image_url ? (
                                <Image
                                    src={user.profile_image_url}
                                    width={36}
                                    height={36}
                                    alt={fullName}
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {fullName}
                            </p>

                            <p className="text-xs text-gray-500">
                                {user.email ?? "—"}
                            </p>
                        </div>
                    </div>
                );
            },
        }),

        columnHelper.accessor("phone", {
            header: "Phone",

            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.phone || "—"}
                </span>
            ),
        }),

        columnHelper.accessor("legal_document_url", {
            header: "Legal Document",

            cell: ({ row }) => {
                const user = row.original;

                if (user.role === "admin") {
                    return (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-green-500">
                            Admin
                        </span>
                    );
                }

                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.legal_document_url
                            ? "bg-gray-100 text-green-500"
                            : "bg-red-100 text-red-500"
                            }`}
                    >
                        {user.legal_document_url
                            ? "Uploaded"
                            : "Not Uploaded"}
                    </span>
                );
            },
        }),

        columnHelper.accessor("verification_status", {
            header: "Verification Status",

            cell: ({ row }) => {
                const user = row.original;

                if (user.role === "admin") {
                    return (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-green-500">
                            Admin
                        </span>
                    );
                }

                // Default missing verification status to pending
                const status: VerificationStatus =
                    user.verification_status ?? "pending";

                const config = statusConfig[status];

                return (
                    <button
                        type="button"
                        onClick={() =>
                            onVerificationChange(user)
                        }
                        className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                    >
                        {config.label}
                    </button>
                );
            },
        }),

        columnHelper.accessor("is_active", {
            header: "Status",

            cell: ({ row }) => {
                const user = row.original;

                return (
                    <Switch
                        checked={user.is_active ?? false}
                        onCheckedChange={(checked) =>
                            onActiveChange(user, checked)
                        }
                        aria-label={`Change ${user.first_name ?? "user"
                            } status`}
                        className="data-checked:bg-green-500 data-unchecked:bg-gray-500"
                    />
                );
            },
        }),

        columnHelper.display({
            id: "actions",

            header: "",

            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        onClick={() =>
                            onSelect(row.original)
                        }
                        size="icon-sm"
                        variant="primary"
                        aria-label={`View ${row.original.first_name ??
                            "user"
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ]);