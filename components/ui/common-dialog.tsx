"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description?: string;

    children?: React.ReactNode;

    cancelText?: string;
    confirmText?: string;

    onCancel?: () => void;
    onConfirm?: () => void;

    isLoading?: boolean;

    showCancel?: boolean;
    showConfirm?: boolean;

    confirmVariant?:
    | "primary"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost";
}

export function CommonDialog({
    open,
    onOpenChange,

    title,
    description,

    children,

    cancelText = "Cancel",
    confirmText = "Confirm",

    onCancel,
    onConfirm,

    isLoading = false,

    showCancel = true,
    showConfirm = true,

    confirmVariant = "primary",
}: CommonDialogProps) {
    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>

                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {children && (
                    <div className="py-2">
                        {children}
                    </div>
                )}

                {(showCancel || showConfirm) && (
                    <DialogFooter>
                        {showCancel && (
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                        )}

                        {showConfirm && (
                            <Button
                                type="button"
                                variant={confirmVariant}
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Please wait..."
                                    : confirmText}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}