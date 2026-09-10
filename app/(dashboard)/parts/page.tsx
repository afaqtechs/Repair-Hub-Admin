"use client"
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { DataTable } from '@/components/ui/datatable'
import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { useParts, usePartsMutations } from '@/hooks'
import { partColumns } from './components/columns'
import { Part } from '@/types/parts'
import PartDetail from './components/partDetail'
import { toast } from '@/components/ui/toast'
import { useRouter, useSearchParams } from 'next/navigation'

function Parts() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const partId = searchParams.get("partId");

    const [search, setSearch] = useState("");

    const {
        data: parts,
        isLoading: loadingPart,
        refetch: refetchPart,
        isRefetching: refetchingPart,
    } = useParts();

    const { updatePart } = usePartsMutations()

    const filterParts = (parts: Part[], search: string): Part[] => {
        const query = search.trim().toLowerCase();

        return parts.filter((part) => {
            if (!query) {
                return true;
            }

            const searchableText = [
                part.title,
                String(part.price ?? ""),
                `${part.technician?.first_name ?? ""} ${part.technician?.last_name ?? ""}`,
                part.description,
                part.category?.name,
                part.platform?.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    };

    const filteredParts = filterParts(parts?.data ?? [], search);

    const selectedFromList = parts?.data?.find(
        (part) => part.id === partId
    );

    const [selectedPart, setSelectedPart] = useState<Part | null>(
        selectedFromList ?? null
    );

    const handleSelect = (part: Part) => {
        setSelectedPart(part);
    };

    const handleTechnicianSelect = (technicianId: string) => {
        router.push(`/users?technicianId=${technicianId}`);
    };

    const handlePlatformSelect = (platformId: string) => {
        router.push(`/platforms?platformId=${platformId}`);
    };

    const handleCategorySelect = (categoryId: string) => {
        router.push(`/categories?categoryId=${categoryId}`);
    };

    // Active / inactive
    const handleActiveChange = (
        part: Part,
        checked: boolean
    ) => {
        updatePart.mutate({
            id: part.id,
            payload: {
                is_approved: checked,
            },
        }, {
            onSuccess: (success) => {
                if (!success) {
                    toast.add({
                        type: "error",
                        title: "Update Failed",
                        description:
                            "Failed to update status.",
                    });

                    return;
                }

                toast.add({
                    type: "success",
                    title: "Status approved",
                    description:
                        "Status approved successfully.",
                });
            },
        });
    };

    return (
        <>
            {
                selectedPart ? (
                    <PartDetail part={selectedPart} onBack={() => setSelectedPart(null)} />
                ) : (
                    <div className="space-y-8">
                        <PageHeader
                            title="Spare Parts"
                            description="Manage spare parts added to addis repairs."
                        />

                        <div className="space-y-4 rounded-lg bg-card p-6">
                            <DataTableToolbar
                                searchValue={search}
                                onSearchChange={setSearch}
                                searchPlaceholder="Search parts, technicians, categories..."
                                className="w-full lg:w-1/2"
                                showDownload={false}
                                showRefresh={true}
                                onRefresh={() => {
                                    refetchPart();
                                }}
                                refreshing={refetchingPart}
                            />

                            <DataTable
                                columns={partColumns(
                                    handleSelect,
                                    handleActiveChange,
                                    handleTechnicianSelect,
                                    handlePlatformSelect,
                                    handleCategorySelect,
                                )}
                                data={filteredParts}
                                isLoading={loadingPart}
                            />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Parts
