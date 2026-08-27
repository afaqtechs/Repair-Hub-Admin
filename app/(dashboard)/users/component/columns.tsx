"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

import { type DataTableFeatures } from "@/components/ui/data-table-features";
import { Button } from "@/components/ui/button";

export type User = {
    id: string;
    photo: string | null;
    name: string;
    email: string;
    phone: string | null;
    role: "admin" | "technician";
    status: "pending" | "rejected" | "verified";
};

const columnHelper =
    createColumnHelper<DataTableFeatures, User>();

const statusConfig: Record<
    User["status"],
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

export const userColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: ({ column }) => (
            <button
                type="button"
                onClick={() =>
                    column.toggleSorting(
                        column.getIsSorted() === "asc"
                    )
                }
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
            >
                User
                <ArrowUpDown className="h-3 w-3" />
            </button>
        ),

        cell: ({ row }) => {
            const user = row.original;

            const initials = user.name
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
                <div className="flex items-center gap-3">
                    {user.photo ? (
                        <Image
                            src={user.photo}
                            width={36}
                            height={36}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                            {initials}
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {user.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user.email}
                        </p>
                    </div>
                </div>
            );
        },
    }),

    columnHelper.accessor("email", {
        header: "Email",

        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.email || "—"}
            </span>
        ),
    }),


    columnHelper.accessor("phone", {
        header: "Phone",

        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.phone || "—"}
            </span>
        ),
    }),

    columnHelper.accessor("status", {
        header: "Status",

        cell: ({ row }) => {
            const status = row.original.status;
            const config = statusConfig[status];

            return (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                >
                    {config.label}
                </span>
            );
        },
    }),

    columnHelper.display({
        id: "actions",

        header: "",

        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-1">

                <Button
                    variant="primary"
                    aria-label={`Edit ${row.original.name}`}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                <Button
                    variant="destructive"
                    aria-label={`Delete ${row.original.name}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    }),
]);