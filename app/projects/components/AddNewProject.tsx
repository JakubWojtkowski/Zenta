"use client";

import { createProject } from "@/actions/projects";
import React from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";

export default function AddNewProject() {
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm();

    const onSubmit = async (data: { title: string; content: string }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        try {
            await createProject(formData);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h2>
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
                    {/* {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>} */}
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
                        rows={5}
                        className="w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                        placeholder=" "
                    />
                    {/* {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>} */}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
}