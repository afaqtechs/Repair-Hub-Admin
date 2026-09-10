"use client";

import React from "react";
import {
    Search,
    Download,
    RefreshCcw,
    RefreshCw,
} from "lucide-react";

import { Button } from "./button";
import Styles from "@/constants/styles";

import {
    FilterDropdown,
    FilterConfig,
} from "./filter-dropdown";

type DataTableToolbarProps = {
    searchValue?: string;
    onSearchChange?: (value: string) => void;

    searchPlaceholder?: string;

    onDownload?: () => void;

    onRefresh?: () => void;

    downloadLabel?: string;

    downloadDisabled?: boolean;

    refreshing?: boolean;

    showDownload?: boolean;

    showRefresh?: boolean;

    className?: string;

    // Generic filters
    filters?: FilterConfig[];
    filterValues?: Record<
        string,
        string | string[]
    >;

    onFilterChange?: (
        key: string,
        value: string | string[]
    ) => void;

    onResetFilters?: () => void;
};

export function DataTableToolbar({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",

    onDownload,

    onRefresh,

    downloadLabel = "Download",

    downloadDisabled = false,

    refreshing = false,

    showDownload = true,

    showRefresh,

    className = "",

    filters = [],
    filterValues = {},
    onFilterChange,
    onResetFilters,
}: DataTableToolbarProps) {
    const hasFilters =
        filters.length > 0 &&
        !!onFilterChange;

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
                            downloadDisabled ||
                            !onDownload
                        }
                        aria-label={downloadLabel}
                        title={downloadLabel}
                        className="h-10 w-10"
                    >
                        <Download size={18} />
                    </Button>
                )}

                {hasFilters && (
                    <FilterDropdown
                        filters={filters}
                        values={filterValues}
                        onChange={onFilterChange}
                        onReset={onResetFilters}
                    />
                )}

                {showRefresh && (
                    <Button
                        variant="default"
                        onClick={onRefresh}
                        size="icon-lg"
                        disabled={
                            refreshing ||
                            !onRefresh
                        }
                        aria-label={downloadLabel}
                        title={downloadLabel}
                        className={`h-10 w-10`}
                    >
                        <span className={`${refreshing ? "animate-spin" : ""}`}>
                            <RefreshCw size={18} color="#2563EB" />
                        </span>
                    </Button>
                )}
            </div>
        </div>
    );
}
