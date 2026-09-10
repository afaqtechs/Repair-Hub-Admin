
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react'
import { type DataTableFeatures } from "@/components/ui/data-table-features";
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye } from 'lucide-react';
import { Request } from '@/types/requests';

const columnHelper =
    createColumnHelper<DataTableFeatures, Request>();
export const requestColumns = (
    onSelect: (request: Request) => void,
    // onView: (request: request) => void,
    onActiveChange: (
        request: Request,
        checked: boolean
    ) => void,
    onTechnicianSelect: (technicianId: string) => void,
    onPlatformSelect: (platformId: string) => void,
    onCategorySelect: (categoryId: string) => void,
) =>
    columnHelper.columns([
        columnHelper.accessor("title", {
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
                    Title
                    <ArrowUpDown className="h-3 w-3" />
                </button>
            ),

            cell: ({ row }) => {
                const request = row.original;

                const title = request.title ?? "";

                const requestTitle =
                    `${title}`.trim() ||
                    "Unknown";

                const initials = requestTitle
                    .split(" ")
                    .filter(Boolean)
                    .map((title) => title[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                    <button
                        type="button"
                        onClick={() =>
                            onSelect(row.original)
                        }
                        className="min-w-max group cursor-pointer text-left flex items-center gap-3">
                        <div className="flex">
                            {request.images ? (
                                <Image
                                    src={request.images[0]}
                                    width={36}
                                    height={36}
                                    alt={requestTitle}
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div>
                            <p
                                className="text-sm font-medium text-gray-900 group-hover:text-green-500"
                            >
                                {title.substring(0, 30)}
                            </p>
                            <p
                                className="text-xs font-medium text-gray-900 group-hover:text-green-500"
                            >
                                {request.category?.name}
                            </p>
                        </div>
                    </button>
                );
            },
        }),

        columnHelper.accessor("technician_id", {
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
                const request = row.original;
                const technician = request.technician;

                if (!technician) {
                    return (
                        <span className="text-sm text-gray-400">
                            —
                        </span>
                    );
                }

                return (
                    <button
                        type="button"
                        onClick={() =>
                            onTechnicianSelect(request.technician_id)
                        }
                        className="cursor-pointer text-sm text-gray-600 hover:text-green-500 hover:underline"
                    >
                        {technician.first_name} {technician.last_name}
                    </button>
                );
            },
        }),

        columnHelper.accessor("platform_id", {
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
                    Platform
                    <ArrowUpDown className="h-3 w-3" />
                </button>
            ),

            cell: ({ row }) => {
                const request = row.original;
                const platform = request.platform;

                if (!platform) {
                    return (
                        <span className="text-sm text-gray-400">
                            —
                        </span>
                    );
                }

                return (
                    <button
                        type="button"
                        onClick={() =>
                            onPlatformSelect(String(request.platform_id))
                        }
                        className="cursor-pointer text-sm text-gray-600 hover:text-green-500 hover:underline"
                    >
                        {platform.name}
                    </button>
                );
            },
        }),

        columnHelper.accessor("category_id", {
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
                const request = row.original;
                const category = request.category;

                if (!category) {
                    return (
                        <span className="text-sm text-gray-400">
                            —
                        </span>
                    );
                }

                return (
                    <button
                        type="button"
                        onClick={() =>
                            onCategorySelect(String(request.category_id))
                        }
                        className="cursor-pointer text-sm text-gray-600 hover:text-green-500 hover:underline"
                    >
                        {category.name}
                    </button>
                );
            },
        }),

        columnHelper.accessor("is_approved", {
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
                    Approval
                    <ArrowUpDown className="h-3 w-3" />
                </button>
            ),

            cell: ({ row }) => {
                const request = row.original;

                return (
                    <Switch
                        checked={request.is_approved ?? false}
                        onCheckedChange={(checked) =>
                            onActiveChange(request, checked)
                        }
                        aria-label={`Change ${request.title ?? "request"
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
                        aria-label={`View ${row.original.title ??
                            "request"
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ]);
