"use client";

import { useState } from "react";

import { usePartsByPLatform, usePlatformMutations, usePlatforms, useRequestsByPlatform, useServicesByPlatform } from "@/hooks";
import { DataTable } from "@/components/ui/datatable";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Spinner } from "@/components/ui/loader";
import DeleteModal from "@/components/ui/delete-modal";
import { toast } from "@/components/ui/toast";
import { Platform } from "@/types/platform";
import PlatformDetail from "./components/platformDetail";
import { platformColumns } from "./components/columns";
import AddPlatform from "./components/addPlatform";
import { useSearchParams } from "next/navigation";

function Platforms() {
    const searchParams = useSearchParams();

    const platformId = searchParams.get("platformId");

    const [showDetail, setShowDetail] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [deletedPlatform, setDeletedPlatform] = useState<Platform | null>(null);

    const { deletePlatform } = usePlatformMutations();

    const {
        data: platforms = [],
        isLoading: loadingPlatform,
    } = usePlatforms();

    const selectedFromList = platforms?.find(
        (platform) => platform.id === platformId
    );

    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(selectedFromList || null);

    const {
        data: parts,
        isLoading: loadingPart,
    } = usePartsByPLatform(String(selectedPlatform?.id));

    const {
        data: services,
        isLoading: loadingService,
    } = useServicesByPlatform(String(selectedPlatform?.id));

    const {
        data: requests,
        isLoading: loadingRequest,
    } = useRequestsByPlatform(String(selectedPlatform?.id));

    // Open full platform detail
    const handleOpenDetail = () => {
        if (!selectedPlatform) return;

        setShowDetail(true);
    };

    // Back from full detail
    const handleBack = () => {
        setShowDetail(false);
    };

    const handleDelete = (platform: Platform) => {
        setDeletedPlatform(platform);
    };

    const handleSelectPlatform = (platform: Platform) => {
        setSelectedPlatform(platform);
    };

    const handleConfirmDelete = async () => {
        if (!deletedPlatform) return;

        try {
            await deletePlatform.mutateAsync(deletedPlatform.id);

            toast.add({
                type: "success",
                description: `"${deletedPlatform.name}" has been deleted successfully.`,
            });

            if (selectedPlatform?.id === deletedPlatform.id) {
                setSelectedPlatform(null);
                setShowDetail(false);
            }

            setDeletedPlatform(null);
        } catch (error) {
            console.error("Failed to delete platform:", error);

            toast.add({
                type: "error",
                description: "Failed to delete platform. Please try again.",
            });
        }
    };

    /*
     * Full platform detail view
     */

    if (showDetail && selectedPlatform) {
        return (
            <PlatformDetail
                platform={selectedPlatform}
                parts={parts}
                services={services}
                requests={requests}
                onBack={handleBack}
            />
        );
    }

    const loading = loadingPart || loadingService || loadingRequest;

    /*
     * Main categories page
     */
    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Categories"
                description="Manage Addis repairs categories."
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >
                            Add Platform
                        </Button>
                    </div>
                }
            />

            {/* Categories */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Table */}
                <div className="col-span-2 rounded-lg bg-card p-6 flex flex-col space-y-4">
                    <DataTableToolbar
                        searchPlaceholder="Search categories..."
                    />

                    <DataTable
                        columns={platformColumns(
                            handleDelete,
                            handleSelectPlatform
                        )}
                        data={platforms}
                        isLoading={loadingPlatform}
                    />
                </div>

                {/* platform Preview */}
                <div className="h-max flex flex-col  rounded-lg bg-card p-3">
                    {selectedPlatform ? (
                        <>
                            {/* Preview Header */}
                            < div className="w-full items-center justify-center bg-gray-100 py-1 px-3 rounded-lg">
                                <h2 className="text-center text-base font-semibold text-gray-900">
                                    {selectedPlatform.name}
                                </h2>
                            </div>
                            {loading ? (
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
                                    <div className="mt-2 space-y-5">
                                        {/* Name */}
                                        {/* Icon */}
                                        {selectedPlatform.icon_url && (
                                            <Image
                                                src={
                                                    selectedPlatform.icon_url
                                                }
                                                width={50}
                                                height={30}
                                                alt={
                                                    selectedPlatform.name
                                                }
                                                className="mt-2 w-full h-30 rounded-xl object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3 bg-gray-100 p-3 rounded-lg">
                                        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
                                            <p className="text-xs font-medium text-gray-500">
                                                Name
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    selectedPlatform.name
                                                }
                                            </p>
                                        </div>

                                        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
                                            <p className="text-xs font-medium text-gray-500">
                                                Total Parts
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    parts?.length
                                                }
                                            </p>
                                        </div>


                                        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
                                            <p className="text-xs font-medium text-gray-500">
                                                Total Services
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    services?.length
                                                }
                                            </p>
                                        </div>


                                        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
                                            <p className="text-xs font-medium text-gray-500">
                                                Total Requests
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    requests?.length
                                                }
                                            </p>
                                        </div>
                                        {/* View More */}
                                        <div className="mt-auto pt-6">
                                            <Button
                                                variant="primary"
                                                className="w-full"
                                                onClick={
                                                    handleOpenDetail
                                                }
                                            >
                                                View Full Details
                                            </Button>
                                        </div>

                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        /*
                         * Empty state
                         */
                        <div className="flex min-h-75 flex-col items-center justify-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                <span className="text-lg text-gray-400">
                                    —
                                </span>
                            </div>

                            <h2 className="mt-4 text-sm font-semibold text-gray-900">
                                Platform Details
                            </h2>

                            <p className="mt-1 max-w-xs text-sm text-gray-500">
                                Select a platform from the table
                                to view its details.
                            </p>
                        </div>
                    )}
                </div>
            </div >

            {/* Add platform Modal */}
            < AddPlatform
                showModal={showAddModal}
                setShowModal={setShowAddModal}
            />

            {/* Delete platform Modal */}
            <DeleteModal
                open={!!deletedPlatform}
                onClose={() => setDeletedPlatform(null)}
                onConfirm={handleConfirmDelete}
                title="Delete platform?"
                description="Are you sure you want to delete this platform? This action cannot be undone."
                itemName={deletedPlatform?.name}
                loading={deletePlatform.isPending}
            />
        </div >
    );
}

export default Platforms;