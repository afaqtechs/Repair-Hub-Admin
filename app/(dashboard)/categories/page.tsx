"use client";

import React, { useState } from "react";

import { useCategories, useCategoryMutations, usePartsByCategory, useRequestsByCategory, useServicesByCategory } from "@/src/hooks";
import { DataTable } from "@/components/ui/datatable";
import { categoryColumns } from "./components/columns";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import AddCategory from "./components/addCategory";
import CategoryDetail from "./components/categoryDetail";
import { Category } from "@/types/category";
import Image from "next/image";
import { Spinner } from "@/components/ui/loader";
import DeleteModal from "@/components/ui/delete-modal";
import { toast } from "@/components/ui/toast";

function Categories() {
    // Category selected from the table
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [deletedCategory, setDeletedCategory] = useState<Category | null>(null);

    const { deleteCategory } = useCategoryMutations();

    const {
        data: categories = [],
        isLoading: loadingCategory,
    } = useCategories();

    const {
        data: parts,
        isLoading: loadingPart,
    } = usePartsByCategory(String(selectedCategory?.id));

    const {
        data: services,
        isLoading: loadingService,
    } = useServicesByCategory(String(selectedCategory?.id));

    const {
        data: requests,
        isLoading: loadingRequest,
    } = useRequestsByCategory(String(selectedCategory?.id));

    // Open full category detail
    const handleOpenDetail = () => {
        if (!selectedCategory) return;

        setShowDetail(true);
    };

    // Back from full detail
    const handleBack = () => {
        setShowDetail(false);
    };

    const handleDelete = (category: Category) => {
        setDeletedCategory(category);
    };

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleConfirmDelete = async () => {
        if (!deletedCategory) return;

        try {
            await deleteCategory.mutateAsync(deletedCategory.id);

            toast.add({
                type: "success",
                description: `"${deletedCategory.name}" has been deleted successfully.`,
            });

            if (selectedCategory?.id === deletedCategory.id) {
                setSelectedCategory(null);
                setShowDetail(false);
            }

            setDeletedCategory(null);
        } catch (error) {
            console.error("Failed to delete category:", error);

            toast.add({
                type: "error",
                description: "Failed to delete category. Please try again.",
            });
        }
    };

    /*
     * Full category detail view
     */

    if (showDetail && selectedCategory) {
        return (
            <CategoryDetail
                category={selectedCategory}
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
                description="Manage RepairHub repair categories."
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="primary">
                            Export
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >
                            Add Category
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
                        columns={categoryColumns(
                            handleDelete,
                            handleSelectCategory
                        )}
                        data={categories}
                        isLoading={loadingCategory}
                    />
                </div>

                {/* Category Preview */}
                <div className="h-max flex flex-col  rounded-lg bg-card p-3">
                    {selectedCategory ? (
                        <>
                            {/* Preview Header */}
                            < div className="w-full items-center justify-center bg-gray-100 py-1 px-3 rounded-lg">
                                <h2 className="text-center text-base font-semibold text-gray-900">
                                    {selectedCategory.name}
                                </h2>
                            </div>
                            {loading ? (
                                <div className="flex min-h-50 items-center justify-center">
                                    <Spinner
                                        variant="primary"
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
                                        {selectedCategory.icon_url && (
                                            <Image
                                                src={
                                                    selectedCategory.icon_url
                                                }
                                                width={50}
                                                height={30}
                                                alt={
                                                    selectedCategory.name
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
                                                    selectedCategory.name
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
                                Category Details
                            </h2>

                            <p className="mt-1 max-w-xs text-sm text-gray-500">
                                Select a category from the table
                                to view its details.
                            </p>
                        </div>
                    )}
                </div>
            </div >

            {/* Add Category Modal */}
            < AddCategory
                showModal={showAddModal}
                setShowModal={setShowAddModal}
            />

            {/* Delete Category Modal */}
            <DeleteModal
                open={!!deletedCategory}
                onClose={() => setDeletedCategory(null)}
                onConfirm={handleConfirmDelete}
                title="Delete category?"
                description="Are you sure you want to delete this category? This action cannot be undone."
                itemName={deletedCategory?.name}
                loading={deleteCategory.isPending}
            />
        </div >
    );
}

export default Categories;