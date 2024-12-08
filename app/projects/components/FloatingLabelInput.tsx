import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FloatingLabelInputProps {
    id: string;
    label: string;
    type?: string;
    isTextArea?: boolean;
    placeholder?: string;
    register: UseFormRegisterReturn;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    id,
    label,
    type = "text",
    isTextArea = false,
    placeholder = "",
    register,
}) => {
    return (
        <div className="relative">
            {isTextArea ? (
                <textarea
                    id={id}
                    {...register}
                    className="resize-none w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                    placeholder={placeholder}
                    rows={6}
                ></textarea>
            ) : (
                <input
                    id={id}
                    type={type}
                    {...register}
                    className="w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                    placeholder={placeholder}
                />
            )}
            <label
                htmlFor={id}
                className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
            >
                {label}
            </label>
        </div>
    );
};
