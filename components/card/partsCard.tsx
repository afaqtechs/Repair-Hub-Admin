import { Part } from "@/types/parts";
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { MoreVertical } from "lucide-react";

type PartsCardProps = {
  part: Part;
  onClick?: () => void;
};

function PartsCard({ part, onClick }: PartsCardProps) {
  const technicianName = part.technician
    ? `${part.technician.first_name} ${part.technician.last_name}`
    : "Unknown technician";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-slate-100/50 transition p-2"
    >
      {/* Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
        {part.images ? (
          <Image
            src={part.images[0]}
            alt={String(part.title)}
            width={80}
            height={80}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        <Badge variant={part.condition?.name === "New" ? "softSuccess" : "softDestructive"} className="absolute top-2 right-2">{part.condition?.name}</Badge>

      </div>

      {/* Content */}
      <div className="py-1 mt-2">
        {/* Price */}
        <p className="text-lg font-bold font-mono text-emerald-500">
          {part.price !== null
            ? `${part.price?.toLocaleString()} ETB`
            : "Price not set"}
        </p>

        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-primary">
            {part?.title
              ? part.title.length > 15
                ? `${part.title.slice(0, 15)}...`
                : part.title
              : "Untitled"}
          </h3>
        </div>

        {/* Technician */}
        <div className="flex flex-row justify-between items-center border-t border-gray-200 pt-1">
          <p className="text-sm font-medium text-gray-700">
            {technicianName}
          </p>
          <span className="p-1 bg-slate-200 rounded-full">
            <MoreVertical className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default PartsCard;