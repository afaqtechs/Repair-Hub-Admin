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
import { useRouter, useSearchParams } from 'next/navigation'

function Requests() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const requestId = searchParams.get("requestId");

    const [search, setSearch] = useState("");

    const {
        data: requests,
        isLoading: loadingRequest,
        refetch: refetchRequest,
        isRefetching: refetchingRequest,
    } = useRequests();

    const { updateRequest } = useRequestMutations()

    const filterRequests = (requests: Request[], search: string): Request[] => {
        const query = search.trim().toLowerCase();

        return requests.filter((request) => {
            if (!query) {
                return true;
            }

            const searchableText = [
                request.title,
                `${request.technician?.first_name ?? ""} ${request.technician?.last_name ?? ""}`,
                request.description,
                request.category?.name,
                request.platform?.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    };

    const filteredRequests = filterRequests(requests?.data ?? [], search);

    const selectedFromList = requests?.data?.find(
        (request) => request.id === requestId
    );

    const [selectedRequest, setSelectedRequest] =
        useState<Request | null>(selectedFromList ?? null);

    const handleSelect = (request: Request) => {
        setSelectedRequest(request);
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
                                searchValue={search}
                                onSearchChange={setSearch}
                                searchPlaceholder="Search parts, technicians, categories..."
                                className="w-full lg:w-1/2"
                                showDownload={false}
                                showRefresh={true}
                                onRefresh={() => {
                                    refetchRequest();
                                }}
                                refreshing={refetchingRequest}
                            />

                            <DataTable
                                columns={requestColumns(
                                    handleSelect,
                                    handleActiveChange,
                                    handleTechnicianSelect,
                                    handlePlatformSelect,
                                    handleCategorySelect,
                                )}
                                data={filteredRequests}
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
