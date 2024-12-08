"use client";

import { createProject } from "@/actions/projects";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FloatingLabelInput } from "./FloatingLabelInput"; // Placeholder zewnętrzny
import { PlusIcon, X } from "lucide-react";

interface AddNewProjectProps {
    username: string;
}


export default function AddNewProject({ username }: AddNewProjectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: { title: string; content: string }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        try {
            await createProject(formData);
            reset();
            setIsOpen(false);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <>
            {/* Button to open the modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex justify-center items-center gap-2"
            >
                <PlusIcon size={18} /> Project
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="relative bg-white shadow-xl w-1/3 h-full p-6 flex flex-col ml-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Create New Project
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Title Field */}
                            <FloatingLabelInput
                                id="title"
                                type="text"
                                label="Title"
                                register={register("title", { required: "Title is required" })}

                            />

                            {/* Description Field */}
                            <FloatingLabelInput
                                id="content"
                                label="Description.."
                                isTextArea
                                register={register("content", { required: "Description is required" })}
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
