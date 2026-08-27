"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";
import Image from "next/image";

import { type DataTableFeatures } from "@/components/ui/data-table-features";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";

const columnHelper =
    createColumnHelper<DataTableFeatures, Category>();

export const categoryColumns = (
    onDelete: (category: Category) => void,
    onView: (category: Category) => void
) => columnHelper.columns([
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
                Category
                <ArrowUpDown className="h-3 w-3" />
            </button>
        ),

        cell: ({ row }) => {
            const category = row.original;

            return (
                <div className="flex items-center gap-3">
                    {category.icon_url ? (
                        <Image
                            src={category.icon_url}
                            width={40}
                            height={40}
                            alt={category.name}
                            className="h-10 w-10 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-medium text-gray-400">
                            —
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-900">
                            {category.name}
                        </p>
                    </div>
                </div>
            );
        },
    }),

    columnHelper.accessor("slug", {
        header: "Slug",

        cell: ({ row }) => (
            <span className="text-sm text-gray-900">
                {row.original.slug || "—"}
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
                    aria-label={`View ${row.original.name}`}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() =>
                        onDelete(row.original)
                    }
                    aria-label={`Delete ${row.original.name}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    }),
]);