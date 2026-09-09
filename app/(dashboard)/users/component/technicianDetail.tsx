import { useState } from "react";

import { PageHeader } from "@/components/ui/page-header";

import { Part } from "@/types/parts";
import { Request } from "@/types/requests";
import { Service } from "@/types/services";
import PartsCard from "@/components/card/partsCard";
import ServiceCard from "@/components/card/ServiceCard";
import RequestCard from "@/components/card/RequestCard";
import { Profile } from "@/types/profiles";
import Image from "next/image";
import { ArrowLeft, Star } from 'lucide-react';
import { Spinner } from "@/components/ui/loader";

type TechnicianDetailProps = {
    techncician: Profile;
    parts?: Part[] | null;
    services?: Service[] | null;
    requests?: Request[] | null;
    onBack: () => void;
    isLoading: boolean;
};

function TechnicianDetail({
    techncician,
    parts,
    services,
    requests,
    onBack,
    isLoading,
}: TechnicianDetailProps) {

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
                    title={techncician.first_name + " " + techncician.last_name}
                    description={`Manage ${techncician.first_name} details.`}
                />
            </div>

            {/* Category content */}
            {isLoading ? (
                <div className="flex min-h-50 items-center justify-center">
                    <Spinner
                        variant="success"
                        size="default"
                        type="loader"
                        className=""
                    />
                </div>
            ) : (

                <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Category */}
                        <div className="h-max">
                            <div className="flex flex-col items-center gap-0">
                                {techncician.profile_image_url ? (
                                    <Image
                                        src={techncician.profile_image_url}
                                        width={400}
                                        height={400}
                                        alt={techncician.first_name}
                                        className="h-100 lg:h-80 w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                        —
                                    </div>
                                )}

                                <div>
                                    <h2 className="-mt-3 text-base bg-gray-100 px-5 rounded-xl font-semibold text-gray-900">
                                        {techncician.first_name} {techncician.last_name}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 rounded-xl bg-card p-6">
                            <div className="mb-6">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Technician Information
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Contact information, experience and account details.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                                {/* Email */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.email || "—"}
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.phone || "—"}
                                    </p>
                                </div>

                                {/* Experience */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Experience
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.experience_years != null
                                            ? `${techncician.experience_years} ${techncician.experience_years === 1
                                                ? "year"
                                                : "years"
                                            }`
                                            : "—"}
                                    </p>
                                </div>

                                {/* Address */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Address
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.address || "—"}
                                    </p>
                                </div>

                                {/* City */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        City
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.city || "—"}
                                    </p>
                                </div>

                                {/* Rating - with Star icon */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Rating
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        {techncician.rating_avg != null && (
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        )}
                                        <span className="text-sm font-semibold text-gray-900">
                                            {techncician.rating_avg != null
                                                ? techncician.rating_avg.toFixed(1)
                                                : "—"}
                                        </span>

                                        {techncician.rating_count != null && (
                                            <span className="text-sm text-gray-500">
                                                ({techncician.rating_count} reviews)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Verification */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Verification
                                    </p>

                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${techncician.verification_status === "verified"
                                                ? "bg-green-50 text-green-700"
                                                : techncician.verification_status === "rejected"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-yellow-50 text-yellow-700"
                                                }`}
                                        >
                                            {techncician.verification_status
                                                ? techncician.verification_status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                techncician.verification_status.slice(1)
                                                : "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Availability
                                    </p>

                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${techncician.is_available
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {techncician.is_available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>
                                </div>

                                {/* Account status */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Account Status
                                    </p>

                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${techncician.is_active
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {techncician.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Last seen */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Last Seen
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {techncician.last_seen_at
                                            ? new Date(
                                                techncician.last_seen_at
                                            ).toLocaleString()
                                            : "Never"}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    About Technician
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {techncician.bio ||
                                        "No biography has been provided by this technician."}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="rounded-lg bg-card p-6">
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
                                                No parts found in this category.
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
                                                No services found in this category.
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
                                                No requests found in this category.
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
                </>
            )}
        </div>
    )
}

export default TechnicianDetail
