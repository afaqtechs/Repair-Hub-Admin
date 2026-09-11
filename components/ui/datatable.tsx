"use client";

import {
    useTable,
    type ColumnDef,
    type RowData,
    type SortingState,
    type ColumnFiltersState,
    type RowSelectionState,
    type PaginationState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { useState } from "react";

import {
    features,
    type DataTableFeatures,
} from "./data-table-features";
import { Spinner } from "./loader";

interface DataTableProps<
    TData extends RowData & { id: string }
> {
    columns: ColumnDef<DataTableFeatures, TData>[];
    data: TData[];

    isSelect?: boolean;

    onSelectRow?: (row: TData) => void;

    selectedRowId?: string;

    isLoading?: boolean;
}

export function DataTable<
    TData extends RowData & { id: string }
>({
    columns,
    data,
    isSelect = false,
    onSelectRow,
    selectedRowId,
    isLoading = false,
}: DataTableProps<TData>) {
    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>({});

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });


    const table = useTable({
        features,

        data,

        columns,

        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination,
        },

        onSortingChange: setSorting,

        onColumnFiltersChange: setColumnFilters,

        onRowSelectionChange: setRowSelection,

        onPaginationChange: setPagination,
    });

    const pageCount = table.getPageCount();

    return (
        <div className="w-full">
            {/* Table */}
            <div className="overflow-hidden">
                <Table>
                    {/* Header */}
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className=""
                                >
                                    {headerGroup.headers.map(
                                        (header) => (
                                            <TableHead
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : (
                                                        <table.FlexRender
                                                            header={
                                                                header
                                                            }
                                                        />
                                                    )}
                                            </TableHead>
                                        )
                                    )}
                                </TableRow>
                            ))}
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <Spinner
                                        variant="success"
                                        size="default"
                                        fullScreen
                                        text="Loading..."
                                        type="spinner"
                                        className=""
                                    />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table
                                .getRowModel()
                                .rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected()
                                                ? "selected"
                                                : undefined
                                        }
                                        className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-100 ${row.original.id ===
                                            selectedRowId
                                            ? "bg-blue-100"
                                            : "bg-white"
                                            }`}
                                        onClick={() =>
                                            onSelectRow?.(
                                                row.original
                                            )
                                        }
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                >
                                                    <table.FlexRender
                                                        cell={cell}
                                                    />
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="flex w-full items-center justify-between gap-3">
                {/* Row count */}
                {isSelect ? (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {
                            table.getFilteredSelectedRowModel()
                                .rows.length
                        }{" "}
                        of{" "}
                        {
                            table.getFilteredRowModel()
                                .rows.length
                        }{" "}
                        row(s) selected.
                    </div>
                ) : (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {
                            table.getFilteredRowModel()
                                .rows.length
                        }{" "}
                        row(s) found.
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 py-4">

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            table.previousPage()
                        }
                        disabled={
                            !table.getCanPreviousPage()
                        }
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-500">
                        Page{" "}
                        <span className="font-medium text-gray-700">
                            {pagination.pageIndex + 1}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-700">
                            {pageCount}
                        </span>
                    </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            table.nextPage()
                        }
                        disabled={
                            !table.getCanNextPage()
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}