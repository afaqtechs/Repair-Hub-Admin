"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
    showModal: boolean;
    setShowModal: (open: boolean) => void;

    title?: string;
    description?: string;

    children: React.ReactNode;

    className?: string;
};

export function Modal({
    showModal,
    setShowModal,
    title,
    description,
    children,
    className,
}: ModalProps) {
    return (
        <Dialog
            open={showModal}
            onOpenChange={setShowModal}
        >
            <DialogContent
                className={`max-h-[90vh] bg-card ring-0 overflow-y-auto rounded-2xl p-0 sm:max-w-lg ${className ?? ""}`}
            >
                {(title || description) && (
                    <DialogHeader className="border-b border-gray-100 px-6 py-5">
                        {title && (
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {title}
                            </DialogTitle>
                        )}

                        {description && (
                            <DialogDescription className="text-sm text-gray-500">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}

                {children}
            </DialogContent>
        </Dialog>
    );
}