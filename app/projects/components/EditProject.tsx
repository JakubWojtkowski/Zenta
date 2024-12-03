"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { X } from "lucide-react";
import { updateProject } from "@/actions/projects";  // Upewnij się, że masz funkcję do aktualizacji projektu

type EditProjectProps = {
    projectId: string;
    initialTitle: string;
    initialContent: string;
};

export default function EditProject({ projectId, initialTitle, initialContent }: EditProjectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            title: initialTitle,
            content: initialContent,
        },
    });

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
                className="text-sm text-blue-400 bg-blue-50 p-2 rounded-md"
            >
                Edit
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
                    <div className="relative bg-white shadow-xl w-[25%] max-w-sm h-full p-6 flex flex-col">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-700">
                            {initialTitle}.
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title Field */}
                            <div className="relative">
                                <Label.Root
                                    htmlFor="title"
                                    className="absolute left-2 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Title
                                </Label.Root>
                                <input
                                    id="title"
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className="w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                                    placeholder=" "
                                />
                            </div>

                            {/* Description Field */}
                            <div className="relative">
                                <Label.Root
                                    htmlFor="content"
                                    className="absolute left-2 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Description
                                </Label.Root>
                                <textarea
                                    id="content"
                                    {...register("content", { required: "Description is required" })}
                                    rows={6}
                                    className="w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                                    placeholder=" "
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
