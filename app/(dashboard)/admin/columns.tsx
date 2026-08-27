"use client";

import { DataTableFeatures } from "@/components/ui/data-table-features";
import { createColumnHelper } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Eye,
    Edit,
    Trash2,
} from "lucide-react";

export type RecentActivity = {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    status: "completed" | "pending" | "in-progress";
};

const columnHelper =
    createColumnHelper<DataTableFeatures, RecentActivity>();

const statusConfig: Record<
    RecentActivity["status"],
    {
        bg: string;
        text: string;
        label: string;
    }
> = {
    completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
    },

    pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
    },

    "in-progress": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "In Progress",
    },
};

export const columns = columnHelper.columns([
    columnHelper.accessor("user", {
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
            const user = row.original.user;

            const initials = user
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                        {initials}
                    </div>

                    <span className="text-sm font-medium text-gray-900">
                        {user}
                    </span>
                </div>
            );
        },
    }),

    columnHelper.accessor("action", {
        header: "Action",

        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.action}
            </span>
        ),
    }),

    columnHelper.accessor("timestamp", {
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
                Time
                <ArrowUpDown className="h-3 w-3" />
            </button>
        ),

        cell: ({ row }) => (
            <span className="text-sm text-gray-500">
                {row.original.timestamp}
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
                <button
                    type="button"
                    aria-label={`View activity by ${row.original.user}`}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <Eye className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label={`Edit activity by ${row.original.user}`}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <Edit className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label={`Delete activity by ${row.original.user}`}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ),
    }),
]);