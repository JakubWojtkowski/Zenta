"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { User } from "@prisma/client";
import { addMemberToProject, getAvailableUsers } from "@/actions/users";
import { X } from "lucide-react";

interface AddUserToProjectProps {
    projectId: string;
}

export default function AddUserToProject({ projectId }: AddUserToProjectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // Funkcja do generowania awatara na podstawie username
    const generateAvatar = (username: string): string => {
        const trimmedUsername = username.trim();
        if (trimmedUsername.length < 2) return "??";
        const firstLetter = trimmedUsername.charAt(0).toUpperCase();
        const lastLetter = trimmedUsername.charAt(trimmedUsername.length - 1).toUpperCase();
        return `${firstLetter}${lastLetter}`;
    };

    const fetchAvailableUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const availableUsers: User[] = await getAvailableUsers(projectId);
            setUsers(availableUsers);
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

    const handleAddUser = async (userId: string) => {
        try {
            const formData = new FormData();
            formData.set("projectId", projectId);
            formData.set("userId", userId);
            await addMemberToProject(formData);
            alert("User added successfully!");
            setIsOpen(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Failed to add user: ${err.message}`);
            } else {
                alert("Failed to add user: Unknown error.");
            }
        }
    };

    const openModal = () => {
        fetchAvailableUsers();
        setIsOpen(true);
    };

    return (
        <>
            <button
                className="w-8 h-8 text-xl rounded-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold"
                onClick={openModal}
            >
                +
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true"></div>
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full relative">
                    {/* Przyciski nagłówka */}
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-bold">Add User</Dialog.Title>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>
                    <Dialog.Description className="text-gray-600 text-sm">
                        Select a user to add to this project.
                    </Dialog.Description>

                    {/* Obsługa stanu ładowania, błędów i użytkowników */}
                    {loading ? (
                        <p className="mt-4 text-center text-gray-500">Loading users...</p>
                    ) : error ? (
                        <p className="mt-4 text-center text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p className="mt-4 text-center text-gray-500">No users available to add.</p>
                    ) : (
                        <ul className="mt-4 space-y-3">
                            {users.map((user) => (
                                <li key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {/* Awatar */}
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-semibold rounded-full">
                                            {generateAvatar(user.username)}
                                        </div>
                                        {/* Nazwa użytkownika */}
                                        <span className="text-gray-700">{user.username}</span>
                                    </div>
                                    {/* Przycisk dodawania */}
                                    <button
                                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        onClick={() => handleAddUser(user.id)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Dialog>
        </>
    );
}
