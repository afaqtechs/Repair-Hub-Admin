"use client";

import {
    Bell,
    Check,
    FileText,
    MessageSquare,
    X,
} from "lucide-react";

import { useNotifications } from "@/hooks";

function Notifications() {
    const {
        notifications,
        unreadCount,
        markAsSeen,
        clearAll,
        isSeen,
        isLoading,
    } = useNotifications();

    if (isLoading) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-500" />
                    Loading notifications...
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Notifications
                    </h1>

                    {unreadCount > 0 && (
                        <span className="pointer-events-none flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-gray-100">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>

                {notifications.length > 0 && unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="cursor-pointer rounded-lg px-3 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Empty state */}
            {notifications.length === 0 ? (
                <div className="flex min-h-75 flex-col items-center justify-center rounded-xl bg-card px-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Bell className="h-5 w-5 text-gray-400" />
                    </div>

                    <h2 className="text-sm font-semibold text-gray-900">
                        No notifications
                    </h2>

                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        New feedback and technician document uploads
                        will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl bg-card">
                    {notifications.map((notification) => {
                        const isUnread = !isSeen(notification.id);

                        return (
                            <div
                                key={notification.id}
                                onClick={() => {
                                    if (isUnread) {
                                        markAsSeen(notification.id);
                                    }
                                }}
                                className={`group relative flex gap-4 border-b border-gray-100 p-4 transition-colors last:border-b-0 ${isUnread
                                        ? "bg-green-50/40 hover:bg-green-50"
                                        : "hover:bg-gray-50"
                                    }`}
                            >
                                {/* Icon */}
                                <div className="relative shrink-0">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${notification.type === "feedback"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-purple-100 text-purple-600"
                                            }`}
                                    >
                                        {notification.type === "feedback" ? (
                                            <MessageSquare className="h-4 w-4" />
                                        ) : (
                                            <FileText className="h-4 w-4" />
                                        )}
                                    </div>

                                    {isUnread && (
                                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3
                                                className={`text-sm ${isUnread
                                                        ? "font-semibold text-gray-900"
                                                        : "font-medium text-gray-700"
                                                    }`}
                                            >
                                                {notification.title}
                                            </h3>

                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {notification.description}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-xs text-gray-400">
                                            {formatRelativeTime(
                                                notification.createdAt
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${notification.type === "feedback"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-purple-50 text-purple-600"
                                                }`}
                                        >
                                            {notification.type === "feedback"
                                                ? "Feedback"
                                                : "Document"}
                                        </span>

                                        {!isUnread && (
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <Check className="h-3 w-3" />
                                                Seen
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Mark as seen */}
                                {isUnread && (
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            markAsSeen(notification.id);
                                        }}
                                        className="absolute bottom-3 right-3 hidden cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 group-hover:block"
                                        title="Mark as seen"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now.getTime() - date.getTime();

    if (diff < 0) {
        return "Just now";
    }

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString();
}

export default Notifications;