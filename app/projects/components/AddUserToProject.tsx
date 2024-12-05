"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { User } from "@prisma/client"; // Importujemy typ użytkownika z Prisma
import { addMemberToProject, getAvailableUsers } from "@/actions/users";

interface AddUserToProjectProps {
    projectId: string;
}

export default function AddUserToProject({ projectId }: AddUserToProjectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]); // Typujemy tablicę użytkowników jako User[]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>(""); // Typ błędu jako string

    const fetchAvailableUsers = async () => {
        setLoading(true);
        try {
            const availableUsers: User[] = await getAvailableUsers(projectId); // Zmienna typu User[]
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
                {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <Dialog.Title className="text-xl font-bold mb-4">Add User to Project</Dialog.Title>
                    <Dialog.Description>
                        Select a user to add to this project.
                    </Dialog.Description>

                    {loading ? (
                        <p>Loading users...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p>No users available to add.</p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {users.map((user) => (
                                <li key={user.id} className="flex justify-between items-center">
                                    <span>{user.username}</span>
                                    <button
                                        className="text-sm text-blue-500 hover:underline"
                                        onClick={() => handleAddUser(user.id)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        className="mt-6 text-gray-500"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Dialog>
        </>
    );
}
