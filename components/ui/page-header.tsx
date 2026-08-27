"use client";

import React from "react";

type PageHeaderProps = {
    title?: string;
    description?: string;

    action?: React.ReactNode;

    className?: string;
};

export function PageHeader({
    title,
    description,
    action,
    className = "",
}: PageHeaderProps) {
    return (
        <div
            className={`flex items-start justify-between gap-3 ${className}`}
        >
            {/* Header */}
            <div className="min-w-0">
                {title && (
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {title}
                    </h1>
                )}

                {description && (
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                )}
            </div>

            {/* Action */}
            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}