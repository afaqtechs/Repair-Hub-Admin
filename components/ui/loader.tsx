"use client";

import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, Loader } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const loaderVariants = cva("animate-spin", {
    variants: {
        variant: {
            default: "text-primary",
            primary: "text-blue-600",
            secondary: "text-gray-500",
            success: "text-green-600",
            warning: "text-yellow-600",
            danger: "text-red-600",
            white: "text-white",
            gray: "text-gray-400",
        },
        size: {
            xs: "h-3 w-3",
            sm: "h-4 w-4",
            default: "h-6 w-6",
            md: "h-8 w-8",
            lg: "h-10 w-10",
            xl: "h-14 w-14",
            "2xl": "h-20 w-20",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

interface LoaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
    type?: "spinner" | "loader" | "refresh";
    text?: string;
    textPosition?: "left" | "right" | "bottom" | "top";
    overlay?: boolean;
    fullScreen?: boolean;
}

export function Spinner({
    variant,
    size,
    type = "spinner",
    text,
    textPosition = "right",
    overlay = false,
    fullScreen = false,
    className,
    ...props
}: LoaderProps) {
    const IconMap = {
        loader: Loader2,
        spinner: Loader,
        refresh: RefreshCw,
    };

    const Icon = IconMap[type] || Loader2;

    const renderLoader = () => (
        <div
            className={cn(
                "flex items-center justify-center gap-3",
                {
                    "flex-col": textPosition === "bottom" || textPosition === "top",
                    "flex-row": textPosition === "left" || textPosition === "right",
                    "flex-row-reverse": textPosition === "left",
                    "flex-col-reverse": textPosition === "top",
                },
                className
            )}
            {...props}
        >
            <Icon
                className={cn(
                    loaderVariants({ variant, size }),
                    "shrink-0"
                )}
            />
            {text && (
                <span
                    className={cn(
                        "text-sm font-medium",
                        {
                            "text-muted-foreground":
                                !variant || variant === "default" || variant === "secondary",
                            "text-blue-600": variant === "primary",
                            "text-green-600": variant === "success",
                            "text-yellow-600": variant === "warning",
                            "text-red-600": variant === "danger",
                            "text-white": variant === "white",
                            "text-gray-400": variant === "gray",
                        }
                    )}
                >
                    {text}
                </span>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    {renderLoader()}
                </div>
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                {renderLoader()}
            </div>
        );
    }

    return renderLoader();
}

// Skeleton Loader Component
interface SkeletonLoaderProps {
    count?: number;
    type?: "text" | "avatar" | "card" | "table";
    className?: string;
}

export function SkeletonLoader({
    count = 1,
    type = "text",
    className,
}: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (type) {
            case "avatar":
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                        <div className="space-y-2">
                            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                            <div className="h-2 w-16 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                );
            case "card":
                return (
                    <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                                <div className="h-2 w-1/2 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full animate-pulse rounded bg-gray-200" />
                            <div className="h-2 w-5/6 animate-pulse rounded bg-gray-200" />
                            <div className="h-2 w-4/6 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                );
            case "table":
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                            <div className="h-8 flex-1 animate-pulse rounded bg-gray-200" />
                            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                        </div>
                        {Array.from({ length: count }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 border-t border-gray-100 pt-3"
                            >
                                <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
                                <div className="h-6 flex-1 animate-pulse rounded bg-gray-200" />
                                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="space-y-2">
                        {Array.from({ length: count }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-3 animate-pulse rounded bg-gray-200",
                                    className
                                )}
                            />
                        ))}
                    </div>
                );
        }
    };

    return <div className="w-full">{renderSkeleton()}</div>;
}

// Page Loader Component
export function PageLoader() {
    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Loading...</p>
        </div>
    );
}

// Button Loader Component
export function ButtonLoader({ className }: { className?: string }) {
    return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}