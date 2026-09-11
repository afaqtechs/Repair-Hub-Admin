"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";

import { type DataTableFeatures } from "@/components/ui/data-table-features";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/announcement";

const columnHelper =
    createColumnHelper<DataTableFeatures, Announcement>();

export const announcementColumns = (
    onDelete: (announcement: Announcement) => void,
    onView: (announcement: Announcement) => void
) => columnHelper.columns([
    columnHelper.accessor("subject", {
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
                Announcement
                <ArrowUpDown className="h-3 w-3" />
            </button>
        ),

        cell: ({ row }) => {
            const announcement = row.original;

            const title = announcement.subject ?? "";

            const announcementName =
                `${title}`.trim() ||
                "Unknown";

            const initials = announcementName
                .split(" ")
                .filter(Boolean)
                .map((title) => title[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
                <button
                    onClick={() =>
                        onView(row.original)
                    }
                    className="group cursor-pointer flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                        {initials}
                    </div>
                    <div>
                        <p className="group-hover:text-green-500 text-sm text-gray-900">
                            {announcement.subject}
                        </p>
                    </div>
                </button>
            );
        },
    }),

    columnHelper.accessor("message", {
        header: "Message",

        cell: ({ row }) => (
            <span className="text-sm text-gray-900">
                {row.original.message.substring(0, 50) || "—"}
            </span>
        ),
    }),

    columnHelper.display({
        id: "actions",

        header: "",

        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-1">
                <Button
                    variant="primary"
                    size="icon-sm"
                    onClick={() =>
                        onView(row.original)
                    }
                    aria-label={`View ${row.original.subject}`}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() =>
                        onDelete(row.original)
                    }
                    aria-label={`Delete ${row.original.subject}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    }),
]);