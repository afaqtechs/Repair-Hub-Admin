"use client";

import React, { useState } from "react";

import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTable } from "@/components/ui/datatable";
import { PageHeader } from "@/components/ui/page-header";

import {
    useFeedbackMutations,
    useFeedbacks,
    useFeedbacksByTechnician,
} from "@/hooks";

import { Feedback } from "@/types/feedback";

import feedbackColumns from "./components/columns";

import DeleteModal from "@/components/ui/delete-modal";
import { CommonDialog } from "@/components/ui/common-dialog";
import { toast } from "@/components/ui/toast";

function TechnicianFeedbacks() {
    const [selectedFeedback, setSelectedFeedback] =
        useState<Feedback | null>(null);

    const [selectedTechnicianId, setSelectedTechnicianId] =
        useState<string | null>(null);

    const [showDeleteModal, setShowDeleteModal] =
        useState<Feedback | null>(null);

    // ─────────────────────────────────────────────
    // All feedbacks
    // ─────────────────────────────────────────────

    const {
        data: feedbacks = [],
        isLoading,
    } = useFeedbacks();

    // ─────────────────────────────────────────────
    // Feedbacks by technician
    // ─────────────────────────────────────────────

    const {
        data: technicianFeedbacks = [],
        isLoading: isTechnicianFeedbacksLoading,
    } = useFeedbacksByTechnician(
        selectedTechnicianId ?? ""
    );

    // ─────────────────────────────────────────────
    // Mutations
    // ─────────────────────────────────────────────

    const { deleteFeedback } = useFeedbackMutations();

    // ─────────────────────────────────────────────
    // Technician clicked
    // ─────────────────────────────────────────────

    const handleSelectTechnician = (
        feedback: Feedback
    ) => {
        if (!feedback.technician_id) return;

        setSelectedTechnicianId(
            feedback.technician_id
        );
    };

    // ─────────────────────────────────────────────
    // View feedback
    // ─────────────────────────────────────────────

    const handleSelectFeedback = (
        feedback: Feedback
    ) => {
        setSelectedFeedback(feedback);
    };

    // ─────────────────────────────────────────────
    // Delete feedback
    // ─────────────────────────────────────────────

    const handleDelete = (feedback: Feedback) => {
        setShowDeleteModal(feedback);
    };

    // ─────────────────────────────────────────────
    // Confirm delete
    // ─────────────────────────────────────────────

    const handleConfirmDelete = () => {
        if (!showDeleteModal) return;

        deleteFeedback.mutate(showDeleteModal.id, {
            onSuccess: (success) => {
                if (!success) {
                    toast.add({
                        type: "error",
                        title: "Delete Failed",
                        description:
                            "Failed to delete feedback.",
                    });

                    return;
                }

                toast.add({
                    type: "success",
                    title: "Feedback Deleted",
                    description:
                        "Feedback deleted successfully.",
                });

                setShowDeleteModal(null);
            },

            onError: (error) => {
                console.error(
                    "Delete feedback error:",
                    error
                );

                toast.add({
                    type: "error",
                    title: "Delete Failed",
                    description:
                        "Failed to delete feedback.",
                });
            },
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Feedbacks"
                description="Manage Addis repair feedback."
            />

            <div className="space-y-4 rounded-lg bg-card p-6">
                <DataTableToolbar
                    searchPlaceholder="Search feedbacks..."
                    className="w-full lg:w-1/2"
                />

                <DataTable
                    columns={feedbackColumns(
                        handleDelete,
                        handleSelectFeedback,
                        handleSelectTechnician
                    )}
                    data={feedbacks}
                    isLoading={isLoading}
                />
            </div>

            {/* ─────────────────────────────────────── */}
            {/* Technician feedbacks dialog */}
            {/* ─────────────────────────────────────── */}

            <CommonDialog
                open={!!selectedTechnicianId}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedTechnicianId(null);
                    }
                }}
                title="Technician Feedbacks"
                description="All feedback received by this technician."
                showConfirm={false}
            >
                <div className="max-h-125 overflow-y-auto">
                    {isTechnicianFeedbacksLoading ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Loading feedbacks...
                        </div>
                    ) : technicianFeedbacks.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No feedbacks found for this
                            technician.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {technicianFeedbacks.map(
                                (feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="rounded-lg bg bg-gray-50 p-4"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-lg font-medium">
                                                {
                                                    feedback.subject
                                                }
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    feedback.created_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            {feedback.message ||
                                                "No comment"}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </CommonDialog>

            {/* ─────────────────────────────────────── */}
            {/* Full feedback dialog */}
            {/* ─────────────────────────────────────── */}

            <CommonDialog
                open={!!selectedFeedback}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedFeedback(null);
                    }
                }}
                title="Feedback Details"
                description="Review the feedback submitted by the technician."
                showConfirm={false}

            >

                {selectedFeedback && (
                    <div className="space-y-6">
                        {/* Technician */}
                        <div className="flex items-center gap-3 rounded-xl bg-gray-50/70 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                                {[
                                    selectedFeedback.technician?.first_name,
                                    selectedFeedback.technician?.last_name,
                                ]
                                    .filter(Boolean)
                                    .map((name) => name?.[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Technician
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                                    {[
                                        selectedFeedback.technician?.first_name,
                                        selectedFeedback.technician?.last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "Unknown technician"}
                                </p>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Subject
                            </p>

                            <h3 className="mt-1.5 text-base font-semibold leading-6 text-gray-900">
                                {selectedFeedback.subject || "No subject"}
                            </h3>
                        </div>

                        {/* Feedback */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Feedback
                            </p>

                            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {selectedFeedback.message ||
                                        "No feedback provided."}
                                </p>
                            </div>
                        </div>

                        {/* Submitted */}
                        <div className="border-t border-gray-300 pt-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Submitted
                                </p>

                                <p className="text-sm font-medium text-gray-700">
                                    {selectedFeedback.created_at
                                        ? new Date(
                                            selectedFeedback.created_at
                                        ).toLocaleString()
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </CommonDialog>


            {/* ─────────────────────────────────────── */}
            {/* Delete modal */}
            {/* ─────────────────────────────────────── */}

            <DeleteModal
                open={!!showDeleteModal}
                onClose={() =>
                    setShowDeleteModal(null)
                }
                onConfirm={handleConfirmDelete}
                title="Delete feedback?"
                description="Are you sure you want to delete this feedback? This action cannot be undone."
                itemName={
                    showDeleteModal?.message ||
                    "this feedback"
                }
                loading={deleteFeedback.isPending}
            />
        </div>
    );
}

export default TechnicianFeedbacks;