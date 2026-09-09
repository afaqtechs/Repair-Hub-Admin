"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/ui/page-header";

import { Part } from "@/types/parts";
import { Request } from "@/types/requests";
import { Service } from "@/types/services";
import PartsCard from "@/components/card/partsCard";
import ServiceCard from "@/components/card/ServiceCard";
import RequestCard from "@/components/card/RequestCard";
import { Platform } from "@/types/platform";

type platformDetailProps = {
    platform: Platform;
    parts?: Part[] | null;
    services?: Service[] | null;
    requests?: Request[] | null;
    onBack: () => void;
};

function PlatformDetail({
    platform,
    parts,
    services,
    requests,
    onBack,
}: platformDetailProps) {
    const [activeTab, setActiveTab] = useState("parts");

    const tabs = [
        {
            label: "Parts",
            key: "parts",
        },
        {
            label: "Services",
            key: "services",
        },
        {
            label: "Requests",
            key: "requests",
        },
    ];

    const title = platform.name ?? "";

    const platformName =
        `${title}`.trim() ||
        "Unknown";

    const initials = platformName
        .split(" ")
        .filter(Boolean)
        .map((title) => title[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to categories"
                    className="mt-1 flex p-1 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>

                <PageHeader
                    title={platform.name}
                    description={`Manage ${platform.name} platform details.`}
                />
            </div>

            {/* platform content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* platform */}
                <div className="h-max">
                    <div className="flex flex-col items-center gap-0">
                        {platform.icon_url ? (
                            <Image
                                src={platform.icon_url}
                                width={80}
                                height={80}
                                alt={platform.name}
                                className="h-100 lg:h-80 w-full rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-semibold text-green-600">
                                {initials}
                            </div>
                        )}

                        <div>
                            <h2 className="-mt-3 text-base bg-gray-100 px-5 rounded-xl font-semibold text-gray-900">
                                {platform.name}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Information */}
                <div className="col-span-2 rounded-lg bg-card p-6">
                    {/* Tabs */}
                    <div className="flex w-full items-center justify-between gap-6 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full relative flex cursor-pointer items-center justify-center px-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.key
                                    ? "text-[#3fc92f]"
                                    : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}

                                {activeTab === tab.key && (
                                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#42f54b]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="mt-5">
                        {/* Parts */}
                        {activeTab === "parts" && (
                            <>
                                {!parts || parts.length === 0 ? (
                                    <div className="flex min-h-40 items-center justify-center rounded-lg bg-gray-50">
                                        <p className="text-sm text-gray-500">
                                            No parts found in this platform.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                        {parts.map((part) => (
                                            <PartsCard
                                                key={part.id}
                                                part={part}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Services */}
                        {activeTab === "services" && (
                            <>
                                {!services || services.length === 0 ? (
                                    <div className="flex min-h-40 items-center justify-center rounded-lg bg-gray-50">
                                        <p className="text-sm text-gray-500">
                                            No services found in this platform.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                        {services.map((service) => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Requests */}
                        {activeTab === "requests" && (
                            <>
                                {!requests || requests.length === 0 ? (
                                    <div className="flex min-h-40 items-center justify-center rounded-lg bg-gray-50">
                                        <p className="text-sm text-gray-500">
                                            No requests found in this platform.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                        {requests.map((request) => (
                                            <RequestCard
                                                key={request.id}
                                                request={request}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlatformDetail;