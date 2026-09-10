import { Request } from "@/types/requests";
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { CheckCheck, X } from "lucide-react";

type RequestCardProps = {
    request: Request;
    onClick?: () => void;
};

function RequestCard({ request, onClick }: RequestCardProps) {
    const technicianName = request.technician
        ? `${request.technician.first_name} ${request.technician.last_name}`
        : "Unknown technician";

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer rounded-xl bg-slate-100/50 p-2 transition"
        >
            {/* Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
                {request.images?.length ? (
                    <Image
                        src={request.images[0]}
                        alt={String(request.title)}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                    </div>
                )}

                <Badge
                    variant={request?.is_active ? "softSuccess" : "softDestructive"}
                    className="absolute right-2 top-2"
                >
                    {request?.is_active ? "Active" : "In Active"}
                </Badge>
            </div>

            {/* Content */}
            <div className="mt-2 py-1">
                {/* Price */}
                <Badge
                    variant={request?.priority === "normal" ? "softSuccess" : "softDestructive"}
                    className="capitalize"
                >
                    {request?.priority}
                </Badge>

                {/* Title */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-primary">
                        {request?.title
                            ? request.title.length > 15
                                ? `${request.title.slice(0, 15)}...`
                                : request.title
                            : "Untitled"}
                    </h3>
                </div>

                {/* Technician */}
                <div className="flex flex-row items-center justify-between border-t border-gray-200 pt-1">
                    <p className="text-sm font-medium text-gray-700">
                        {technicianName}
                    </p>

                    <span title="Approval status" className="p-1 rounded-full hover:bg-gray-300">
                        {request?.is_approved ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                        ) : (
                            <X className="h-4 w-4 text-red-500" />
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RequestCard;