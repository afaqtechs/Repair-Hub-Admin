"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Styles from "@/constants/styles";
import { useCategoryMutations } from "@/hooks";

type AddCategoryProps = {
    showModal: boolean;
    setShowModal: (open: boolean) => void;
};

function AddCategory({
    showModal,
    setShowModal,
}: AddCategoryProps) {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { createCategory } = useCategoryMutations();

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const removeImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setImage(null);
        setPreview(null);
    };

    const resetForm = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setName("");
        setImage(null);
        setPreview(null);
        createCategory.reset();
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            resetForm();
        }

        setShowModal(open);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        if (!image) {
            return;
        }

        try {
            await createCategory.mutateAsync({
                name: name.trim(),
                icon_url: image,
            });

            resetForm();
            setShowModal(false);
        } catch {
            // Mutation error is displayed below.
        }
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <Modal
            showModal={showModal}
            setShowModal={handleClose}
            title="Add Category"
            description="Create a new repair category for RepairHub."
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-6 px-6 py-3"
            >
                {/* Category name */}
                <div className="space-y-2">
                    <label
                        htmlFor="category-name"
                        className="text-sm font-medium text-gray-900"
                    >
                        Category Name
                    </label>

                    <input
                        id="category-name"
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Android"
                        disabled={createCategory.isPending}
                        className={`mt-2 ${Styles.input}`}
                    />
                </div>

                {/* Category icon */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                        Category Icon
                    </label>

                    <label
                        htmlFor="category-image"
                        className={`mt-2 group relative flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${preview
                            ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/5"
                            : "border-gray-200 bg-gray-50 hover:border-[#5B3DF5]/40 hover:bg-[#5B3DF5]/5"
                            }`}
                    >
                        {preview ? (
                            <>
                                <Image
                                    src={preview}
                                    width={300}
                                    height={300}
                                    alt="Category preview"
                                    className="h-28 w-28 rounded-2xl object-cover shadow-sm"
                                />

                                <span className="mt-3 text-xs font-medium text-gray-600">
                                    Click to change image
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                    <ImagePlus className="h-5 w-5 text-[#5B3DF5]" />
                                </div>

                                <span className="text-sm font-medium text-gray-900">
                                    Upload category icon
                                </span>

                                <span className="mt-1 text-xs text-gray-500">
                                    PNG, JPG or WEBP
                                </span>
                            </>
                        )}

                        <input
                            id="category-image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            disabled={createCategory.isPending}
                            className="hidden"
                        />
                    </label>

                    {image && (
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <Upload className="h-4 w-4 shrink-0 text-gray-400" />

                                <span className="truncate text-xs text-gray-600">
                                    {image.name}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={removeImage}
                                disabled={createCategory.isPending}
                                className="ml-2 cursor-pointer rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Error */}
                {createCategory.isError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {createCategory.error instanceof Error
                            ? createCategory.error.message
                            : "Failed to create category."}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                    <Button
                        variant="default"
                        onClick={() => handleClose(false)}
                        disabled={createCategory.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            createCategory.isPending ||
                            !name.trim() ||
                            !image
                        }
                    >
                        {createCategory.isPending
                            ? "Creating..."
                            : "Add Category"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AddCategory;