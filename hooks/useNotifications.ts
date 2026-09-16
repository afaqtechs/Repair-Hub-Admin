import { useCallback, useMemo, useState } from "react";
import { useFeedbacks } from "./useFeedbacks";
import { useTechnicians } from "./useProfiles";

const SEEN_NOTIFICATIONS_KEY = "admin_seen_notifications";

export type NotificationType = "feedback" | "document";

export type AdminNotification = {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    createdAt: string;
    userName: string;
};

export function useNotifications() {
    const {
        data: users,
        isLoading: loadingTechnicians,
    } = useTechnicians();

    const {
        data: feedbacks,
        isLoading: loadingFeedbacks,
    } = useFeedbacks();

    const [seenNotifications, setSeenNotifications] =
        useState<Set<string>>(() => {
            if (typeof window === "undefined") {
                return new Set<string>();
            }

            try {
                const stored = localStorage.getItem(
                    SEEN_NOTIFICATIONS_KEY
                );

                if (!stored) {
                    return new Set<string>();
                }

                return new Set<string>(JSON.parse(stored));
            } catch (error) {
                console.error(
                    "Failed to load seen notifications:",
                    error
                );

                return new Set<string>();
            }
        });

    const saveSeenNotifications = useCallback(
        (ids: Set<string>) => {
            setSeenNotifications(new Set(ids));

            localStorage.setItem(
                SEEN_NOTIFICATIONS_KEY,
                JSON.stringify(Array.from(ids))
            );
        },
        []
    );

    const notifications = useMemo<AdminNotification[]>(() => {
        const documentNotifications: AdminNotification[] =
            (users ?? [])
                .filter(
                    (user) =>
                        user.legal_document_url &&
                        user.verification_status !== "verified"
                )
                .map((user) => ({
                    id: `document-${user.id}-${user.legal_document_url}`,
                    type: "document",
                    title: "New document uploaded",
                    description:
                        `${user.first_name ?? ""} ${
                            user.last_name ?? ""
                        }`.trim() ||
                        "A technician uploaded a document.",
                    createdAt:
                        user.updated_at ??
                        user.created_at ??
                        new Date().toISOString(),
                    userName:
                        `${user.first_name ?? ""} ${
                            user.last_name ?? ""
                        }`.trim() ||
                        "Unknown user",
                }));

        const feedbackNotifications: AdminNotification[] =
            (feedbacks ?? []).map((feedback) => ({
                id: `feedback-${feedback.id}`,
                type: "feedback",
                title: "New feedback received",
                description:
                    feedback.message ??
                    "A new feedback was submitted.",
                createdAt:
                    feedback.created_at ??
                    new Date().toISOString(),
                userName:
                    `${feedback.technician?.first_name ?? ""} ${
                        feedback.technician?.last_name ?? ""
                    }`.trim() || "Unknown user",
            }));

        return [
            ...documentNotifications,
            ...feedbackNotifications,
        ].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [users, feedbacks]);

    const unreadCount = useMemo(() => {
        return notifications.filter(
            (notification) =>
                !seenNotifications.has(notification.id)
        ).length;
    }, [notifications, seenNotifications]);

    const isSeen = useCallback(
        (notificationId: string) => {
            return seenNotifications.has(notificationId);
        },
        [seenNotifications]
    );

    const markAsSeen = useCallback(
        (notificationId: string) => {
            if (seenNotifications.has(notificationId)) {
                return;
            }

            const updated = new Set(seenNotifications);

            updated.add(notificationId);

            saveSeenNotifications(updated);
        },
        [
            seenNotifications,
            saveSeenNotifications,
        ]
    );

    const clearAll = useCallback(() => {
        if (notifications.length === 0) {
            return;
        }

        const updated = new Set(seenNotifications);

        notifications.forEach((notification) => {
            updated.add(notification.id);
        });

        saveSeenNotifications(updated);
    }, [
        notifications,
        seenNotifications,
        saveSeenNotifications,
    ]);

    return {
        notifications,
        unreadCount,
        isSeen,
        markAsSeen,
        clearAll,
        isLoading:
            loadingTechnicians || loadingFeedbacks,
    };
}