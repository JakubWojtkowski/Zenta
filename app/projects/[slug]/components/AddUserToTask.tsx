"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { User } from "@prisma/client";
import { addUserToTask, getAvailableUsers } from "@/actions/users";

interface AddUserToTaskProps {
    taskId: string;
    projectId: string;
}

export default function AddUserToTask({ taskId, projectId }: AddUserToTaskProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchAvailableUsers = async () => {
        setLoading(true);
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
        console.log("taskId:", taskId); // Sprawdzamy, czy taskId jest przekazywane

        try {
            const formData = new FormData();
            formData.set("taskId", taskId); // Upewnij się, że taskId jest prawidłowo ustawione
            formData.set("userId", userId);
            await addUserToTask(formData, projectId); // Przekazujemy projectId
            alert("User successfully assigned to the task!");
            setIsOpen(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Failed to add user to task: ${err.message}`);
            } else {
                alert("Failed to add user to task: Unknown error.");
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
                className="w-8 h-8 ml-1 text-xl rounded-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold"
                onClick={openModal}
            >
                +
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <Dialog.Title className="text-xl font-bold mb-4">Add User to Task</Dialog.Title>
                    <Dialog.Description>
                        Select a user to assign to this task.
                    </Dialog.Description>

                    {loading ? (
                        <p>Loading users...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p>No users available to assign.</p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {users.map((user) => (
                                <li key={user.id} className="flex justify-between items-center">
                                    <span>{user.username}</span>
                                    <button
                                        className="text-sm text-blue-500 hover:underline"
                                        onClick={() => handleAddUser(user.id)}
                                    >
                                        Assign
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
