"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";

import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";

export type FilterOption = {
    label: string;
    value: string;
};

export type FilterConfig = {
    key: string;
    label: string;
    options: FilterOption[];
    multiple?: boolean;
    countable?: boolean;
};

type FilterDropdownProps = {
    filters: FilterConfig[];
    values: Record<string, string | string[]>;
    onChange: (key: string, value: string | string[]) => void;
    onReset?: () => void;
};

export function FilterDropdown({
    filters,
    values,
    onChange,
    onReset,
}: FilterDropdownProps) {

    const activeFilterCount = filters.reduce((count, filter) => {
        if (filter.countable === false) {
            return count;
        }

        const value = values[filter.key];

        if (Array.isArray(value)) {
            return count + value.length;
        }

        if (
            value !== undefined &&
            value !== "" &&
            value !== "all"
        ) {
            return count + 1;
        }

        return count;
    }, 0);

    const hasActiveFilters = activeFilterCount > 0;

    const handleSingleChange = (
        filter: FilterConfig,
        value: string
    ) => {
        onChange(filter.key, value);
    };

    const handleMultipleChange = (
        filter: FilterConfig,
        value: string,
        checked: boolean
    ) => {
        const currentValue = values[filter.key];

        const current = Array.isArray(currentValue)
            ? currentValue
            : [];

        const next = checked
            ? [...current, value]
            : current.filter((item) => item !== value);

        onChange(filter.key, next);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="default"
                        size="icon-lg"
                        className="relative h-10 w-10"
                        aria-label="Filter"
                        title="Filter"
                    >
                        <Filter size={18} />

                        {hasActiveFilters && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                }
            />

            <DropdownMenuContent
                align="end"
                className="w-64 border-none bg-gray-100 text-gray-900 ring-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm font-semibold">
                        Filters
                    </span>

                    {hasActiveFilters && onReset && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onReset}
                            className="h-7 gap-1 px-2 text-xs"
                        >
                            <RotateCcw size={13} />
                            Reset
                        </Button>
                    )}
                </div>

                <DropdownMenuSeparator />

                {/* Filters */}
                {filters.map((filter, index) => {
                    const currentValue = values[filter.key];

                    return (
                        <React.Fragment key={filter.key}>
                            {/* Filter title */}
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                {filter.label}
                            </div>

                            {filter.options.map((option) => {
                                if (filter.multiple) {
                                    const selected =
                                        Array.isArray(currentValue) &&
                                        currentValue.includes(
                                            option.value
                                        );

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={option.value}
                                            checked={selected}
                                            onCheckedChange={(checked) =>
                                                handleMultipleChange(
                                                    filter,
                                                    option.value,
                                                    checked === true
                                                )
                                            }
                                            className={`
                                                mx-1 my-0.5
                                                rounded-md
                                                cursor-pointer
                                                transition-colors
                                                focus:bg-green-50
                                                focus:text-green-700
                                                ${selected
                                                    ? "bg-green-50 text-green-700 font-medium"
                                                    : "text-foreground"
                                                }
                                            `}
                                        >
                                            {option.label}
                                        </DropdownMenuCheckboxItem>
                                    );
                                }

                                const selected =
                                    currentValue === option.value;

                                return (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={selected}
                                        onCheckedChange={() =>
                                            handleSingleChange(
                                                filter,
                                                option.value
                                            )
                                        }
                                        className={`
                                            mx-1 my-0.5
                                            rounded-md
                                            cursor-pointer
                                            transition-colors
                                            focus:bg-green-50
                                            focus:text-green-700
                                            ${selected
                                                ? "bg-green-50 text-green-700 font-medium"
                                                : "text-foreground"
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}

                            {index < filters.length - 1 && (
                                <DropdownMenuSeparator />
                            )}
                        </React.Fragment>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}