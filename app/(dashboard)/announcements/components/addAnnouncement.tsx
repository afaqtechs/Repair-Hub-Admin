"use client";

import React, { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Styles from "@/constants/styles";
import { useAnnouncementMutations } from "@/hooks";
import { toast } from "@/components/ui/toast";

type AddAnnouncementProps = {
    showModal: boolean;
    setShowModal: (open: boolean) => void;
};

function AddAnnouncement({
    showModal,
    setShowModal,
}: AddAnnouncementProps) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const { createAnnouncement } = useAnnouncementMutations();

    const resetForm = () => {

        setSubject("");
        createAnnouncement.reset();
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

        if (!subject.trim() || !message.trim()) {
            return;
        }

        try {
            await createAnnouncement.mutateAsync({
                subject: subject.trim(),
                message: message.trim().toLowerCase(),
            });

            toast.add({
                type: "success",
                description: `"${subject}" has been created successfully.`,
            });
            resetForm();
            setShowModal(false);
        } catch {
            toast.add({
                type: "error",
                description: "Failed to create announcement. Please try again.",
            });
        }
    };

    return (
        <Modal
            showModal={showModal}
            setShowModal={handleClose}
            title="Add Announcement"
            description="Create a new repair announcement."
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-6 px-6 py-3"
            >
                {/* announcement name */}
                <div className="space-y-2">
                    <label
                        htmlFor="announcement-name"
                        className="text-sm font-medium text-gray-900"
                    >
                        Subject
                    </label>

                    <input
                        id="announcement-subject"
                        type="text"
                        value={subject}
                        onChange={(e) =>
                            setSubject(e.target.value)
                        }
                        placeholder="Subject..."
                        disabled={createAnnouncement.isPending}
                        className={`mt-2 ${Styles.input}`}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="announcement-name"
                        className="text-sm font-medium text-gray-900"
                    >
                        Message
                    </label>

                    <textarea
                        id="announcement-message"
                        value={message}
                        cols={4}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Message..."
                        disabled={createAnnouncement.isPending}
                        className={`mt-2 ${Styles.input} py-2`}
                    />
                </div>

                {/* Error */}
                {createAnnouncement.isError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {createAnnouncement.error instanceof Error
                            ? createAnnouncement.error.message
                            : "Failed to create announcement."}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                    <Button
                        variant="default"
                        onClick={() => handleClose(false)}
                        disabled={createAnnouncement.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            createAnnouncement.isPending ||
                            !subject.trim() || !message.trim()
                        }
                    >
                        {createAnnouncement.isPending
                            ? "Creating..."
                            : "Add Announcement"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AddAnnouncement;