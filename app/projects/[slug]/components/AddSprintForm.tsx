"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { createSprint } from "@/actions/sprints"; // Ścieżka do nowej akcji
import { Task } from "@prisma/client";

interface AddSprintFormProps {
    projectId: string;
    backlogTasks: Task[]; // Zadania z backlogu
}

export default function AddSprintForm({ projectId, backlogTasks }: AddSprintFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
    };

    const handleSubmit = async () => {
        await createSprint({
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            projectId,
            taskIds: selectedTasks,
        });

        alert("Sprint created successfully!");
        setIsOpen(false); // Zamknięcie modala

    };

    return (
        <>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => setIsOpen(true)}
            >
                Create Sprint
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                    <Dialog.Title className="text-xl font-bold mb-4">Create Sprint</Dialog.Title>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Sprint Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Select Tasks</label>
                            <ul className="mt-2 space-y-2">
                                {backlogTasks.map((task) => (
                                    <li key={task.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.includes(task.id)}
                                            onChange={() => toggleTaskSelection(task.id)}
                                            className="mr-2"
                                        />
                                        {task.taskName}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save Sprint
                        </button>
                    </form>

                    <button
                        className="mt-4 text-gray-500 hover:underline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Dialog>
        </>
    );
}
