"use client"
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { DataTable } from '@/components/ui/datatable'
import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { useRequestMutations, useRequests } from '@/hooks'
import RequestDetail from './components/requestDetail'
import { requestColumns } from './components/columns'
import { Request } from '@/types/requests'
import { toast } from '@/components/ui/toast'

function Requests() {

    const {
        data: requests,
        isLoading: loadingRequest,
    } = useRequests();

    const { updateRequest } = useRequestMutations()

    const [selectedRequest, setSelectedRequest] =
        useState<Request | null>(null);

    const handleSelect = (request: Request) => {
        setSelectedRequest(request);
    };

    // Active / inactive
    const handleActiveChange = (
        request: Request,
        checked: boolean
    ) => {
        updateRequest.mutate({
            id: request.id,
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
                selectedRequest ? (
                    <RequestDetail request={selectedRequest} onBack={() => setSelectedRequest(null)} />
                ) : (
                    <div className="space-y-8">
                        <PageHeader
                            title="Requests"
                            description="Manage spare requests added to addis repairs."
                        />

                        <div className="space-y-4 rounded-lg bg-card p-6">
                            <DataTableToolbar
                                searchPlaceholder="Search categories..."
                                className="w-full lg:w-1/2"
                            />

                            <DataTable
                                columns={requestColumns(
                                    handleSelect,
                                    handleActiveChange,
                                    // onView
                                )}
                                data={requests?.data ?? []}
                                isLoading={loadingRequest}
                            />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Requests
