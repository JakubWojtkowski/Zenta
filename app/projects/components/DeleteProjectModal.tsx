"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { deleteProject } from "@/actions/projects";

interface DeleteProjectModalProps {
    projectId: string;
    projectName: string;
}

export default function DeleteProjectModal({ projectId, projectName }: DeleteProjectModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteProject(projectId);
            setIsOpen(false);
            window.location.href = "/";
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm text-red-500 bg-red-50 p-2 rounded-md hover:bg-red-100 flex-1"
            >
                Delete
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
                    <Dialog.Title className="text-lg font-semibold mb-4">
                        Are you sure you want to delete?
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-600 mb-6 text-sm">
                        This action cannot be undone. {projectName && `The project "${projectName}" will be permanently deleted.`}
                    </Dialog.Description>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 flex-1"
                            disabled={loading}
                        >
                            No
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 flex-1"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
