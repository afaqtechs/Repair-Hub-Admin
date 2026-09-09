"use client";

import React, { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Styles from "@/constants/styles";
import { usePlatformMutations } from "@/hooks";
import { toast } from "@/components/ui/toast";

type AddPlatformProps = {
    showModal: boolean;
    setShowModal: (open: boolean) => void;
};

function AddPlatform({
    showModal,
    setShowModal,
}: AddPlatformProps) {
    const [name, setName] = useState("");

    const { createPlatform } = usePlatformMutations();

    const resetForm = () => {

        setName("");
        createPlatform.reset();
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

        try {
            await createPlatform.mutateAsync({
                name: name.trim(),
                slug: name.trim().toLowerCase(),
            });

            toast.add({
                type: "success",
                description: `"${name}" has been created successfully.`,
            });
            resetForm();
            setShowModal(false);
        } catch {
            toast.add({
                type: "error",
                description: "Failed to create platform. Please try again.",
            });
        }
    };

    return (
        <Modal
            showModal={showModal}
            setShowModal={handleClose}
            title="Add Platform"
            description="Create a new repair platform for RepairHub."
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-6 px-6 py-3"
            >
                {/* Platform name */}
                <div className="space-y-2">
                    <label
                        htmlFor="platform-name"
                        className="text-sm font-medium text-gray-900"
                    >
                        Platform Name
                    </label>

                    <input
                        id="platform-name"
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Android"
                        disabled={createPlatform.isPending}
                        className={`mt-2 ${Styles.input}`}
                    />
                </div>

                {/* Error */}
                {createPlatform.isError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {createPlatform.error instanceof Error
                            ? createPlatform.error.message
                            : "Failed to create platform."}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                    <Button
                        variant="default"
                        onClick={() => handleClose(false)}
                        disabled={createPlatform.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            createPlatform.isPending ||
                            !name.trim()
                        }
                    >
                        {createPlatform.isPending
                            ? "Creating..."
                            : "Add Platform"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AddPlatform;