"use client"
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { DataTable } from '@/components/ui/datatable'
import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { useParts, usePartsMutations } from '@/hooks'
import { partColumns } from './components/columns'
import { Part } from '@/types/parts'
import PartDetail from './components/partDetail'

function Parts() {

    const {
        data: parts,
        isLoading: loadingPart,
    } = useParts();

    const { updatePart } = usePartsMutations()

    const [selectedPart, setSelectedPart] =
        useState<Part | null>(null);

    const handleSelect = (part: Part) => {
        setSelectedPart(part);
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
                                searchPlaceholder="Search categories..."
                                className="w-full lg:w-1/2"
                            />

                            <DataTable
                                columns={partColumns(
                                    handleSelect,
                                    handleActiveChange,
                                    // onView
                                )}
                                data={parts?.data ?? []}
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
