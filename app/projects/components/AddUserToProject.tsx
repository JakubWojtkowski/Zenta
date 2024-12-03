"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { X } from "lucide-react";
import { updateProject } from "@/actions/projects"; // Upewnij się, że masz funkcję do aktualizacji projektu

type EditProjectProps = {
    projectId: string;
    initialTitle: string;
    initialContent: string;
    users: Array<{ id: string; username: string }>; // Lista użytkowników do dodania
};

export default function EditProject({ projectId, initialTitle, initialContent, users }: EditProjectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Stan do wyszukiwania
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            title: initialTitle,
            content: initialContent,
        },
    });

    // Upewniamy się, że users jest zdefiniowane, w przeciwnym razie używamy pustej tablicy
    const filteredUsers = (users || []).filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) // Filtrowanie użytkowników na podstawie zapytania
    );

    const onSubmit = async (data: { title: string; content: string }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        try {
            await updateProject(projectId, formData);
            reset();
            setIsOpen(false); // Zamknięcie modalu po udanej aktualizacji
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    return (
        <>
            {/* Button to open the modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-8 h-8 text-xl rounded-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold"
            >
                +
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Modal Sidebar */}
                    <div className="relative bg-white shadow-xl w-[250px] h-[250px] p-4 flex flex-col overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            <X />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Member:</h2>

                        {/* Search Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search User"
                            className="px-3 py-2 border border-gray-300 rounded-md mb-4 w-full"
                        />

                        {/* Users List with Scroll */}
                        <div className="overflow-y-scroll max-h-[140px]">
                            {filteredUsers.length === 0 ? (
                                <p className="text-gray-500">No users found</p>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center py-2 border-b border-gray-200"
                                    >
                                        <span className="text-sm">{user.username}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
