"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    loading?: boolean;
};

function DeleteModal({
    open,
    onClose,
    onConfirm,
    title = "Delete item",
    description = "This action cannot be undone.",
    itemName,
    loading = false,
}: DeleteModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>

                {/* Content */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {description}
                    </p>

                    {itemName && (
                        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
                            <p className="truncate text-sm font-medium text-gray-900">
                                {itemName}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="default"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;