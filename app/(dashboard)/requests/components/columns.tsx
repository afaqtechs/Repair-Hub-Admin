
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react'
import { type DataTableFeatures } from "@/components/ui/data-table-features";
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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
) =>
    columnHelper.columns([
        columnHelper.accessor("title", {
            header: "Title",

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
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex">
                            {request.images ? (
                                <Image
                                    src={request.images[0]}
                                    width={36}
                                    height={36}
                                    alt={requestTitle}
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div>
                            <p
                                onClick={() =>
                                    onSelect(row.original)
                                }
                                className="text-sm font-medium text-gray-900 hover:text-green-500"
                            >
                                {title}
                            </p>
                        </div>
                    </div>
                );
            },
        }),

        columnHelper.accessor("technician_id", {
            header: "Technician",

            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.technician?.first_name || "—"} {row.original.technician?.last_name || "—"}
                </span>
            ),
        }),

        columnHelper.accessor("platform_id", {
            header: "Platform",

            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.platform?.name || "—"}
                </span>
            ),
        }),

        columnHelper.accessor("category_id", {
            header: "Category",

            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.category?.name || "—"}
                </span>
            ),
        }),

        columnHelper.accessor("is_approved", {
            header: "Approval",

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
