import HTMLRenderer from "@/components/ui/HTMLRenderer";
import { PageHeader } from "@/components/ui/page-header";
import { Request } from "@/types/requests";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Package,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RequestDetailProps {
    request: Request;
    onBack: () => void;
}

function RequestDetail({ request, onBack }: RequestDetailProps) {
    const router = useRouter();

    const images = Array.isArray(request.images)
        ? request.images.filter(Boolean)
        : [];

    const [selectedImage, setSelectedImage] = useState(0);

    const currentImage = images[selectedImage];

    const goToPrevious = () => {
        setSelectedImage((current) =>
            current === 0 ? images.length - 1 : current - 1
        );
    };

    const goToNext = () => {
        setSelectedImage((current) =>
            current === images.length - 1 ? 0 : current + 1
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to requests"
                    className="mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <PageHeader
                    title={request.title}
                    description={`Manage ${request.title} request details.`}
                />
            </div>

            {/* Main content */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                {/* Left */}
                <div className="space-y-3 col-span-2">
                    {/* Images */}
                    <div className="rounded-2xl bg-card p-3">
                        <div className="relative overflow-hidden rounded-xl">
                            {currentImage ? (
                                <>
                                    <Image
                                        src={currentImage}
                                        alt="request image"
                                        width={105}
                                        height={105}
                                        className="h-80 w-full object-fit"
                                    />

                                    {/* Image counter */}
                                    {images.length > 1 && (
                                        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                                            {selectedImage + 1} / {images.length}
                                        </div>
                                    )}

                                    {/* Previous */}
                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={goToPrevious}
                                            aria-label="Previous image"
                                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                    )}

                                    {/* Next */}
                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={goToNext}
                                            aria-label="Next image"
                                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex h-105 flex-col items-center justify-center text-gray-400">
                                    <Package className="mb-3 h-12 w-12" />
                                    <p className="text-sm">
                                        No images available
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                                {images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setSelectedImage(index)
                                        }
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition ${selectedImage === index
                                            ? "border-primary"
                                            : "border-transparent hover:border-gray-300"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            width={105}
                                            height={105}
                                            alt={`${request.title} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="rounded-2xl bg-card p-6">
                        <div className="mb-3">
                            <h2 className="text-base font-semibold text-gray-900">
                                Description
                            </h2>
                        </div>

                        {request.description ? (
                            <div className="whitespace-pre-line text-sm leading-7 text-gray-600">
                                <HTMLRenderer html={request.description} />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No description provided.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-3 col-span-3">
                    {/* Main information */}
                    <div className="rounded-2xl bg-card p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                    request
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900">
                                    {request.title}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${request.is_approved
                                        ? "bg-green-50 text-green-700"
                                        : "bg-yellow-50 text-yellow-700"
                                        }`}
                                >
                                    {request.is_approved
                                        ? "Approved"
                                        : "Pending"}
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${request.is_active
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {request.is_active
                                        ? "Active"
                                        : "In Active"}
                                </span>

                                {request?.priority === "urgent" && (
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700`}
                                    >
                                        {request.priority}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="mt-6 divide-y divide-gray-100">
                            <InfoRow
                                label="Category"
                                value={request.category?.name}
                            />

                            <InfoRow
                                label="Platform"
                                value={request.platform?.name}
                            />

                        </div>
                    </div>

                    {/* Technician */}
                    <div className="rounded-2xl bg-card p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                                <UserRound className="h-4 w-4 text-gray-600" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Technician
                                </h2>

                                <p className="text-xs text-gray-400">
                                    request owner
                                </p>
                            </div>
                        </div>

                        <button onClick={() => router.push(`/users?technicianId=${request.technician?.id}`)} className="group cursor-pointer flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                                {request.technician?.profile_image_url ? (
                                    <Image
                                        src={
                                            request.technician
                                                .profile_image_url
                                        }
                                        alt=""
                                        width={105}
                                        height={105}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound className="h-5 w-5 text-gray-400" />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="group-hover:text-green-500 truncate text-sm font-semibold text-gray-900">
                                    {[
                                        request.technician?.first_name,
                                        request.technician?.last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "Unknown technician"}
                                </p>

                                {request.technician?.city && (
                                    <div className="group-hover:text-green-500 mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>
                                            {request.technician.city}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Verification */}
                    <div className="rounded-2xl bg-card p-6">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Verification Status
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {request.is_approved
                                        ? "This request has been approved and is visible to users."
                                        : "This request is waiting for approval."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-gray-400">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-gray-700">
                {value || "—"}
            </span>
        </div>
    );
}

export default RequestDetail;