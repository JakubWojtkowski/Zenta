"use client";

import { useState } from "react";
import { Project } from "@prisma/client";
import { createTask } from "@/actions/tasks";
import { PlusIcon } from "lucide-react";

interface AddNewTaskFormProps {
    project: Project & { members?: { user: { id: string; username: string } }[] };
}

export const AddNewTaskForm = ({ project }: AddNewTaskFormProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
        <>
            {/* Przycisk otwierający modal */}
            <button
                onClick={toggleSidebar}
                className="text-blue-400 text-sm font-semibold px-4 rounded-md transition flex gap-2 hover:text-blue-500"
            >
                <PlusIcon size={18} /> New
            </button>

            {/* Modal sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Tło przyciemniające */}
                    <div
                        onClick={toggleSidebar}
                        className="flex-1 bg-black bg-opacity-50"
                    ></div>

                    {/* Zawartość sidebaru */}
                    <div className="w-1/3 bg-white shadow-lg p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold text-gray-800">Add New Task</h3>
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form action={createTask} className="space-y-4">
                            <input type="hidden" name="projectId" value={project?.id} />

                            {/* Pole nazwy zadania */}
                            <div>
                                <label htmlFor="taskName" className="block text-gray-700 font-medium">
                                    Task Name
                                </label>
                                <input
                                    id="taskName"
                                    type="text"
                                    name="taskName"
                                    placeholder="Enter task name"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                    minLength={3}
                                />
                            </div>

                            {/* Pole opisu */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-gray-700 font-medium"
                                >
                                    Task Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter task description"
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                    minLength={10}
                                ></textarea>
                            </div>

                            {/* Priorytet i przydzielenie użytkownika */}
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="priority"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label
                                        htmlFor="assignedTo"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Assign To
                                    </label>
                                    <select
                                        id="assignedTo"
                                        name="assignedTo"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={!project.members || project.members.length === 0}
                                    >
                                        {project?.members?.map((member) => (
                                            <option key={member.user.id} value={member.user.id}>
                                                {member.user.username}
                                            </option>
                                        )) || (
                                                <option value="">No members available</option>
                                            )}
                                    </select>
                                </div>
                            </div>

                            {/* Estymacja czasu i punktów */}
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="timeEstimate"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Estimated Time (minutes)
                                    </label>
                                    <input
                                        id="timeEstimate"
                                        type="number"
                                        name="timeEstimate"
                                        placeholder="e.g. 120"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                        min={1}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label
                                        htmlFor="estimatedPoints"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Estimated Points
                                    </label>
                                    <input
                                        id="estimatedPoints"
                                        type="number"
                                        name="estimatedPoints"
                                        placeholder="e.g. 5"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                        min={1}
                                    />
                                </div>
                            </div>

                            {/* Przycisk zapisu */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
