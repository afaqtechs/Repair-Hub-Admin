"use client";
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { DataTable } from '@/components/ui/datatable';
import DeleteModal from '@/components/ui/delete-modal';
import { PageHeader } from '@/components/ui/page-header';
import { toast } from '@/components/ui/toast';
import { useAnnouncementMutations, useAnnouncements } from '@/hooks/useAnnouncement';
import { Announcement } from '@/types/announcement';
import React, { useState } from 'react'
import { announcementColumns } from './components/columns';
import { Button } from '@/components/ui/button';
import AddAnnouncement from './components/addAnnouncement';
import { CommonDialog } from '@/components/ui/common-dialog';

function Announcements() {
    const [showAddModal, setShowAddModal] = useState(false);

    const [deletedAnnouncement, setDeletedAnnouncement] = useState<Announcement | null>(null);

    const { deleteAnnouncement } = useAnnouncementMutations();

    const {
        data: announcements = [],
        isLoading: loadingAnnouncement,
    } = useAnnouncements();

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const handleDelete = (announcement: Announcement) => {
        setDeletedAnnouncement(announcement);
    };

    const handleSelectAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const handleConfirmDelete = async () => {
        if (!deletedAnnouncement) return;

        try {
            await deleteAnnouncement.mutateAsync(deletedAnnouncement.id);

            toast.add({
                type: "success",
                description: `"${deletedAnnouncement.subject}" has been deleted successfully.`,
            });

            if (selectedAnnouncement?.id === deletedAnnouncement.id) {
                setSelectedAnnouncement(null);
            }

            setDeletedAnnouncement(null);
        } catch (error) {
            console.error("Failed to delete announcement:", error);

            toast.add({
                type: "error",
                description: "Failed to delete announcement. Please try again.",
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Categories"
                description="Manage Addis repair categories."
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >
                            Add Announcement
                        </Button>
                    </div>
                }
            />

            {/* Categories */}
            <div className="space-y-4 rounded-lg bg-card p-6">
                <DataTableToolbar
                    searchPlaceholder="Search categories..."
                />

                <DataTable
                    columns={announcementColumns(
                        handleDelete,
                        handleSelectAnnouncement
                    )}
                    data={announcements}
                    isLoading={loadingAnnouncement}
                />
            </div>
            {/* Add announcement Modal */}
            < AddAnnouncement
                showModal={showAddModal}
                setShowModal={setShowAddModal}
            />

            <CommonDialog
                open={!!selectedAnnouncement}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedAnnouncement(null);
                    }
                }}
                title={`${selectedAnnouncement?.subject || "Announcement Details"}`}
                description="Review the announcement send for all technicians."
                showConfirm={false}

            >

                {selectedAnnouncement && (
                    <div className="space-y-6">
                        {/* Announcement */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Message
                            </p>

                            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {selectedAnnouncement.message ||
                                        "No message provided."}
                                </p>
                            </div>
                        </div>

                        {/* Submitted */}
                        <div className="border-t border-gray-300 pt-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Created
                                </p>

                                <p className="text-sm font-medium text-gray-700">
                                    {selectedAnnouncement.created_at
                                        ? new Date(
                                            selectedAnnouncement.created_at
                                        ).toLocaleString()
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </CommonDialog>


            {/* Delete Announcement Modal */}
            <DeleteModal
                open={!!deletedAnnouncement}
                onClose={() => setDeletedAnnouncement(null)}
                onConfirm={handleConfirmDelete}
                title="Delete announcement?"
                description="Are you sure you want to delete this announcement? This action cannot be undone."
                itemName={deletedAnnouncement?.subject}
                loading={deleteAnnouncement.isPending}
            />
        </div >
    )
}

export default Announcements
