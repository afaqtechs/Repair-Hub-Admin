"use client";

import { useEffect } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "../ui/button";

/* eslint-disable @next/next/no-img-element */

interface DocumentViewerModalProps {
    open: boolean;
    onClose: () => void;
    url: string;
    fileName?: string | null;
    fileType?: string;
}

export default function DocumentViewerModal({
    open,
    onClose,
    url,
    fileName,
    fileType,
}: DocumentViewerModalProps) {
    const isPdf = fileType === "application/pdf";
    const isImage = fileType?.startsWith("image/");

    // Close with Escape
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl">
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold">
                                {fileName || "Document"}
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                {isPdf ? "PDF Document" : isImage ? "Image Document" : "Document"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Open in new tab */}
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition hover:bg-muted"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">Open</span>
                        </a>

                        {/* Download */}
                        <a
                            href={url}
                            download={fileName || "document"}
                            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition hover:bg-muted"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                        </a>

                        {/* Close */}
                        <Button
                            variant="default"
                            onClick={onClose}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
                            aria-label="Close document"
                        >
                            <X className="h-5 w-5" color="#ff0000" />
                        </Button>
                    </div>
                </div>

                {/* Document */}
                <div className="min-h-0 flex-1 bg-muted/30">
                    {isPdf && (
                        <iframe
                            src={url}
                            title={fileName || "PDF document"}
                            className="h-full w-full border-0"
                        />
                    )}

                    {isImage && (
                        <div className="flex h-full w-full items-center justify-center overflow-auto p-6">
                            <img
                                src={url}
                                loading="lazy"
                                alt={fileName || "Uploaded document"}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    )}

                    {!isPdf && !isImage && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                                <p className="font-medium">
                                    Preview unavailable
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    This file type cannot be previewed.
                                </p>

                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Document
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}