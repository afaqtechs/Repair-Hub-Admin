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
import { Button } from "@/components/ui/button";
import DocumentViewerModal from "@/components/card/DocumentViewerModal";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type TechnicianDetailProps = {
    technician: Profile;
    parts?: Part[] | null;
    services?: Service[] | null;
    requests?: Request[] | null;
    onBack: () => void;
    isLoading: boolean;
};

function TechnicianDetail({
    technician,
    parts,
    services,
    requests,
    onBack,
    isLoading,
}: TechnicianDetailProps) {

    const [activeTab, setActiveTab] = useState("parts");
    const [documentOpen, setDocumentOpen] = useState(false);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [documentLoading, setDocumentLoading] = useState(false);

    const router = useRouter();

    const handleViewDocument = async () => {
        if (!technician.legal_document_url) return;

        try {
            setDocumentLoading(true);

            const { data, error } = await supabase.storage
                .from("legal_documents")
                .createSignedUrl(
                    technician.legal_document_url,
                    60 * 5
                );

            if (error) {
                console.error("Failed to create document URL:", error);
                return;
            }

            setDocumentUrl(data.signedUrl);
            setDocumentOpen(true);
        } catch (error) {
            console.error("Failed to open document:", error);
        } finally {
            setDocumentLoading(false);
        }
    };

    const filePath = technician.legal_document_url;

    const fileName = filePath?.split("/").pop() || "Legal document";

    const fileType = filePath?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : filePath?.match(/\.(jpg|jpeg|png|webp)$/i)
            ? "image/*"
            : "application/octet-stream";

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
                    title={technician.first_name + " " + technician.last_name}
                    description={`Manage ${technician.first_name} details.`}
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
                                {technician.profile_image_url ? (
                                    <Image
                                        src={technician.profile_image_url}
                                        width={400}
                                        height={400}
                                        alt={technician.first_name}
                                        className="h-100 lg:h-80 w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <Image
                                        src="/ui/placeholder_person_photo.webp"
                                        width={400}
                                        height={400}
                                        alt={technician.first_name}
                                        className="h-100 lg:h-80 w-full rounded-2xl object-cover"
                                    />
                                )}

                                <div>
                                    <h2 className="-mt-3 text-base bg-gray-100 px-5 rounded-xl font-semibold text-gray-900">
                                        {technician.first_name} {technician.last_name}
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

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                                {/* Email */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {technician.email || "—"}
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {technician.phone || "—"}
                                    </p>
                                </div>

                                {/* Experience */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Experience
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {technician.experience_years != null
                                            ? `${technician.experience_years} ${technician.experience_years === 1
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
                                        {technician.address || "—"}
                                    </p>
                                </div>

                                {/* City */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        City
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {technician.city || "—"}
                                    </p>
                                </div>

                                {/* Rating - with Star icon */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Rating
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        {technician.rating_avg != null && (
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        )}
                                        <span className="text-sm font-semibold text-gray-900">
                                            {technician.rating_avg != null
                                                ? technician.rating_avg.toFixed(1)
                                                : "—"}
                                        </span>

                                        {technician.rating_count != null && (
                                            <span className="text-sm text-gray-500">
                                                ({technician.rating_count} reviews)
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
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${technician.verification_status === "verified"
                                                ? "bg-green-50 text-green-700"
                                                : technician.verification_status === "rejected"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-yellow-50 text-yellow-700"
                                                }`}
                                        >
                                            {technician.verification_status
                                                ? technician.verification_status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                technician.verification_status.slice(1)
                                                : "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Document
                                    </p>

                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${technician.role === "admin"
                                                ? "bg-green-50 text-green-700" : technician.legal_document_url ? " "
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {technician.role === "admin" ? "Admin" : technician.legal_document_url
                                                ? <>

                                                    <Button
                                                        variant="primary"
                                                        onClick={handleViewDocument}
                                                        disabled={documentLoading}
                                                        className="mt-1 rounded-lg border px-4 py-2 text-sm font-medium"
                                                    >
                                                        {documentLoading ? "Opening..." : "View Document"}
                                                    </Button>

                                                    <DocumentViewerModal
                                                        open={documentOpen}
                                                        onClose={() => {
                                                            setDocumentOpen(false);
                                                            setDocumentUrl(null);
                                                        }}
                                                        url={documentUrl || ""}
                                                        fileName={fileName}
                                                        fileType={fileType}
                                                    />
                                                </>
                                                : "Not Uploaded"}
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
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${technician.is_active
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {technician.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    About Technician
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {technician.bio ||
                                        "No biography has been provided by this technician."}
                                </p>
                            </div>
                        </div>

                    </div>

                    {technician?.role === "technician" && (

                        <div className="rounded-lg bg-card p-3 lg:p-6">
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
                                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                {parts.map((part) => (
                                                    <PartsCard
                                                        key={part.id}
                                                        part={part}
                                                        onClick={() =>
                                                            router.push(`/parts?partId=${part.id}`)
                                                        }
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
                                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                {services.map((service) => (
                                                    <ServiceCard
                                                        key={service.id}
                                                        service={service}
                                                        onClick={() =>
                                                            router.push(`/services?serviceId=${service.id}`)
                                                        }
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
                                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                {requests.map((request) => (
                                                    <RequestCard
                                                        key={request.id}
                                                        request={request}
                                                        onClick={() =>
                                                            router.push(`/requests?requestId=${request.id}`)
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}

export default TechnicianDetail
