"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";

import { Feedback } from "@/types/feedback";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/ui/data-table-features";
import Image from "next/image";

const columnHelper = createColumnHelper<DataTableFeatures, Feedback>();

export const feedbackColumns = (
    onDelete: (feedback: Feedback) => void,
    onView: (feedback: Feedback) => void,
    onTechnicianClick: (feedback: Feedback) => void
) =>
    columnHelper.columns([
        // ─────────────────────────────────────────────
        // Technician
        // ─────────────────────────────────────────────

        columnHelper.accessor("technician", {
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
                    Technician
                    <ArrowUpDown className="h-3 w-3" />
                </button>
            ),

            cell: ({ row }) => {
                const feedback = row.original;
                const technician = feedback.technician;

                const name = [
                    technician?.first_name,
                    technician?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ");

                return (
                    <div className="flex items-center gap-3">
                        {technician?.profile_image_url ? (
                            <Image
                                src={technician.profile_image_url}
                                alt={name || "Technician"}
                                width={10}
                                height={10}
                                className="h-10 w-10 hidden lg:flex rounded-full object-cover"
                            />
                        ) : (
                            <div className=" h-10 w-10 hidden lg:flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-400">
                                {name
                                    ? name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "T"}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                onTechnicianClick(row.original)
                            }
                            className="text-left"
                        >
                            <p className="cursor-pointer text-sm font-medium text-gray-900 hover:text-green-500">
                                {name || "Unknown technician"}
                            </p>

                            {technician?.email && (
                                <p className="text-xs text-gray-500">
                                    {technician.email}
                                </p>
                            )}
                        </button>
                    </div>
                );
            },
        }),

        // ─────────────────────────────────────────────
        // Subject
        // ─────────────────────────────────────────────

        columnHelper.accessor("subject", {
            header: "Subject",

            cell: ({ row }) => (
                <p className="max-w-100 truncate text-sm text-gray-600">
                    {row.original.subject || "—"}
                </p>
            ),
        }),
        // ─────────────────────────────────────────────
        // Comment
        // ─────────────────────────────────────────────

        columnHelper.accessor("message", {
            header: "Feedback",

            cell: ({ row }) => (
                <p className="max-w-100 truncate text-sm text-gray-600">
                    {row.original.message || "—"}
                </p>
            ),
        }),

        // ─────────────────────────────────────────────
        // Actions
        // ─────────────────────────────────────────────

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
                        aria-label="View feedback"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() =>
                            onDelete(row.original)
                        }
                        aria-label="Delete feedback"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ]);

export default feedbackColumns;