"use client";

import React, { useMemo, useState } from "react";
import {
    useAnnouncements,
    useCategories,
    useFeedbacks,
    useParts,
    usePlatforms,
    useRequests,
    useServices,
    useTechnicians,
} from "@/hooks";
import { CommonDialog } from "../ui/common-dialog";
import { Part } from "@/types/parts";
import { Service } from "@/types/services";
import { Request } from "@/types/requests";
import { Profile } from "@/types/profiles";
import { Feedback } from "@/types/feedback";
import { Announcement } from "@/types/announcement";
import { Category } from "@/types/category";
import { Platform } from "@/types/platform";
import Styles from "@/constants/styles";
import HTMLRenderer from "../ui/HTMLRenderer";
import { useRouter } from "next/navigation";

type SearchResult = {
    id: string;
    title: string;
    description?: string;
    type: string;
    link: string;
};

function GlobalSearch({
    onBack,
    showSearchModal,
}: {
    showSearchModal: boolean;
    onBack: () => void;
}) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: parts } = useParts();
    const { data: requests } = useRequests();
    const { data: services } = useServices();
    const { data: technicians } = useTechnicians();
    const { data: feedbacks } = useFeedbacks();
    const { data: announcements } = useAnnouncements();
    const { data: categories } = useCategories();
    const { data: platforms } = usePlatforms();

    const searchResults = useMemo<SearchResult[]>(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return [];

        const results: SearchResult[] = [];

        // -------------------------
        // Parts
        // -------------------------
        parts?.data?.forEach((part: Part) => {
            const searchableText = [
                part.title,
                part.description,
                part.category?.name,
                part.platform?.name,
                part.technician?.first_name,
                part.technician?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: part.id,
                    title: part.title || "Untitled Part",
                    description: part?.description || "",
                    type: "Part",
                    link: `/parts?partId=${part.id}`,
                });
            }
        });

        // -------------------------
        // Services
        // -------------------------
        services?.data?.forEach((service: Service) => {
            const searchableText = [
                service.title,
                service.description,
                service.category?.name,
                service.technician?.first_name,
                service.technician?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: service.id,
                    title: service.title || "Untitled Service",
                    description: service.description || "",
                    type: "Service",
                    link: `/services?serviceId=${service.id}`,
                });
            }
        });

        // -------------------------
        // Requests
        // -------------------------
        requests?.data?.forEach((request: Request) => {
            const searchableText = [
                request.title,
                request.description,
                request.category?.name,
                request.platform?.name,
                request.technician?.first_name,
                request.technician?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: request.id,
                    title: request.title || "Untitled Request",
                    description: request.description || "",
                    type: "Request",
                    link: `/requests?requestId=${request.id}`,
                });
            }
        });

        // -------------------------
        // Technicians
        // -------------------------
        technicians?.forEach((technician: Profile) => {
            const fullName = [
                technician.first_name,
                technician.last_name,
            ]
                .filter(Boolean)
                .join(" ");

            const searchableText = [
                fullName,
                technician.email,
                technician.phone,
                technician.bio,
                technician.city,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: technician.id,
                    title: fullName || "Unnamed Technician",
                    description:
                        technician.bio ||
                        technician.email ||
                        technician.phone || "",
                    type: "Technician",
                    link: `/users?technicianId=${technician.id}`,
                });
            }
        });

        // -------------------------
        // Feedbacks
        // -------------------------
        feedbacks?.forEach((feedback: Feedback) => {
            const searchableText = [
                feedback.subject,
                feedback.message,
                feedback.technician?.first_name,
                feedback.technician?.last_name,
                feedback.technician?.first_name,
                feedback.technician?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: feedback.id,
                    title: feedback.subject || "Feedback",
                    description: feedback.message,
                    type: "Feedback",
                    link: `/feedbacks`,
                });
            }
        });

        // -------------------------
        // Announcements
        // -------------------------
        announcements?.forEach((announcement: Announcement) => {
            const searchableText = [
                announcement.subject,
                announcement.message,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: announcement.id,
                    title: announcement.subject || "Announcement",
                    description:
                        announcement.message || "",
                    type: "Announcement",
                    link: `/announcements`,
                });
            }
        });

        // -------------------------
        // Categories
        // -------------------------
        categories?.forEach((category: Category) => {
            const searchableText = [
                category.name,
                category.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: category.id,
                    title:
                        category.name ||
                        "Category",
                    description: category.description || "",
                    type: "Category",
                    link: `/categories?categoryId=${category.id}`,
                });
            }
        });

        // -------------------------
        // Platforms
        // -------------------------
        platforms?.forEach((platform: Platform) => {
            const searchableText = [
                platform.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(query)) {
                results.push({
                    id: platform.id,
                    title:
                        platform.name ||
                        "Platform",
                    type: "Platform",
                    link: `/platforms?platformId=${platform.id}`,
                });
            }
        });

        return results;
    }, [
        searchQuery,
        parts,
        requests,
        services,
        technicians,
        feedbacks,
        announcements,
        categories,
        platforms,
    ]);

    return (
        <CommonDialog
            open={!!showSearchModal}
            onOpenChange={(open) => {
                if (!open) {
                    setSearchQuery("");
                    onBack();
                }
            }}
            showConfirm={false}
            className="w-md lg:min-w-xl"
        >
            <div className="space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold">
                        Global Search
                    </h1>

                    <p className="text-sm text-muted-foreground mt-1">
                        Search across parts, services, requests,
                        technicians and more.
                    </p>
                </div>

                {/* Search input */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(e.target.value)
                        }
                        placeholder="Search anything..."
                        autoFocus
                        className={`${Styles.input}`}
                    />
                </div>

                {/* Empty state */}
                {!searchQuery.trim() && (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        Start typing to search across the admin panel.
                    </div>
                )}

                {/* No results */}
                {searchQuery.trim() &&
                    searchResults.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-sm font-medium">
                                No results found
                            </p>

                            <p className="text-xs text-muted-foreground mt-1">
                                Try searching with a different keyword.
                            </p>
                        </div>
                    )}

                {/* Results */}
                {searchResults.length > 0 && (
                    <div className="max-h-105 overflow-y-auto space-y-1">
                        {searchResults.map((result) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                type="button"
                                onClick={() => {
                                    router.push(result.link);
                                    onBack();
                                }}
                                className="cursor-pointer hover:bg-gray-300 w-full text-left rounded-lg px-4 py-3 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {result.title}
                                        </p>

                                        {result.description && (
                                            <HTMLRenderer html={result.description.substring(0, 50) + "..."} />
                                        )}
                                    </div>

                                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[10px] font-medium uppercase">
                                        {result.type}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </CommonDialog>
    );
}

export default GlobalSearch;