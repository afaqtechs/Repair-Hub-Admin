import { Service } from '@/types/services'
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react'
import { type DataTableFeatures } from "@/components/ui/data-table-features";
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const columnHelper =
    createColumnHelper<DataTableFeatures, Service>();
export const serviceColumns = (
    onSelect: (service: Service) => void,
    onActiveChange: (
        service: Service,
        checked: boolean
    ) => void,
) =>
    columnHelper.columns([
        columnHelper.accessor("title", {
            header: "Title",

            cell: ({ row }) => {
                const service = row.original;

                const title = service.title ?? "";

                const serviceTitle =
                    `${title}`.trim() ||
                    "Unknown";

                const initials = serviceTitle
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
                        className="group cursor-pointer text-left flex items-center gap-3">
                        <div className="hidden lg:flex">
                            {service.images ? (
                                <Image
                                    src={service.images[0]}
                                    width={36}
                                    height={36}
                                    alt={serviceTitle}
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
                                {title}
                            </p>
                        </div>
                    </button>
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

        columnHelper.accessor("price", {
            header: "Price",

            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.price || "—"} Brr.
                </span>
            ),
        }),

        columnHelper.accessor("is_approved", {
            header: "Approval",

            cell: ({ row }) => {
                const service = row.original;

                return (
                    <Switch
                        checked={service.is_approved ?? false}
                        onCheckedChange={(checked) =>
                            onActiveChange(service, checked)
                        }
                        aria-label={`Change ${service.title ?? "service"
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
                            "service"
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ]);
