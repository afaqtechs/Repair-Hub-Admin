"use client";

import React from "react";
import {
    Search,
    Download,
    Filter,
} from "lucide-react";
import { Button } from "./button";
import Styles from "@/constants/styles";

type DataTableToolbarProps = {
    searchValue?: string;
    onSearchChange?: (value: string) => void;

    searchPlaceholder?: string;

    onDownload?: () => void;
    onFilter?: () => void;

    downloadLabel?: string;
    filterLabel?: string;

    downloadDisabled?: boolean;
    filterDisabled?: boolean;

    showDownload?: boolean;
    showFilter?: boolean;

    className?: string;
};

export function DataTableToolbar({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",

    onDownload,
    onFilter,

    downloadLabel = "Download",
    filterLabel = "Filter",

    downloadDisabled = false,
    filterDisabled = false,

    showDownload = true,
    showFilter = true,

    className = "",
}: DataTableToolbarProps) {
    return (
        <div
            className={`flex items-center gap-2 ${className}`}
        >
            {/* Search */}
            <div className="relative min-w-0 flex-1">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) =>
                        onSearchChange?.(e.target.value)
                    }
                    placeholder={searchPlaceholder}
                    // className="h-9 w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                    className={`${Styles.input} pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all`}
                />
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
                {showDownload && (
                    <Button
                        variant="default"
                        onClick={onDownload}
                        size="icon-lg"
                        disabled={
                            downloadDisabled || !onDownload
                        }
                        aria-label={downloadLabel}
                        title={downloadLabel}
                        className="h-10 w-10"
                    >
                        <Download size={18} />
                    </Button>
                )}

                {showFilter && (
                    <Button
                        variant="default"
                        onClick={onFilter}
                        disabled={
                            filterDisabled || !onFilter
                        }
                        aria-label={filterLabel}
                        title={filterLabel}
                        className="h-10 w-10"
                    >
                        <Filter size={18} />
                    </Button>
                )}
            </div>
        </div>
    );
}