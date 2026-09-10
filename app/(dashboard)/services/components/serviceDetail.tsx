import HTMLRenderer from "@/components/ui/HTMLRenderer";
import { PageHeader } from "@/components/ui/page-header";
import { Service } from "@/types/services";
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

interface ServiceDetailProps {
    service: Service;
    onBack: () => void;
}

function ServiceDetail({ service, onBack }: ServiceDetailProps) {
    const router = useRouter();

    const images = Array.isArray(service.images)
        ? service.images.filter(Boolean)
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

    const formatPrice = (price?: number | null) => {
        if (price === null || price === undefined) {
            return "Price not available";
        }

        return `${price.toLocaleString()} ETB`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to services"
                    className="mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <PageHeader
                    title={service.title}
                    description={`Manage ${service.title} service details.`}
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
                                        alt="service image"
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
                                            alt={`${service.title} ${index + 1}`}
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

                        {service.description ? (
                            <div className="whitespace-pre-line text-sm leading-7 text-gray-600">
                                <HTMLRenderer html={service.description} />
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
                                    service
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900">
                                    {service.title}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${service.is_approved
                                        ? "bg-green-50 text-green-700"
                                        : "bg-yellow-50 text-yellow-700"
                                        }`}
                                >
                                    {service.is_approved
                                        ? "Approved"
                                        : "Pending"}
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${service.is_active
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {service.is_active
                                        ? "Active"
                                        : "In Active"}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-6 rounded-xl bg-gray-50 p-4">
                            <div className="flex flex-row justify-between gap-3">
                                <p className="text-xs font-medium text-gray-400">
                                    Price
                                </p>

                                <p className={`text-xs font-medium ${service?.is_negotiable ? "bg-green-50 text-green-700" : "bg-red-100 text-red-700"} py-0 px-3 rounded-full`}>
                                    {service?.is_negotiable ? "Negotiable" : "Not negotiable"}
                                </p>
                            </div>


                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {formatPrice(service.price)}
                            </p>

                            {service.is_negotiable && (
                                <p className="mt-1 text-xs text-green-600">
                                    Price is negotiable
                                </p>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="mt-6 divide-y divide-gray-100">
                            <InfoRow
                                label="Category"
                                value={service.category?.name}
                            />

                            <InfoRow
                                label="Platform"
                                value={service.platform?.name}
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
                                    service owner
                                </p>
                            </div>
                        </div>

                        <button onClick={() => router.push(`/users?technicianId=${service.technician?.id}`)} className="group cursor-pointer flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                                {service.technician?.profile_image_url ? (
                                    <Image
                                        src={
                                            service.technician
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
                                        service.technician?.first_name,
                                        service.technician?.last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "Unknown technician"}
                                </p>

                                {service.technician?.city && (
                                    <div className="group-hover:text-green-500 mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>
                                            {service.technician.city}
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
                                    {service.is_approved
                                        ? "This service has been approved and is visible to users."
                                        : "This service is waiting for approval."}
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

export default ServiceDetail;