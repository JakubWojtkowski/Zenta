"use client";

import { useState } from "react";
import { addTimeLog } from "@/actions/tasks"; // Akcja do dodawania logu czasu


export function AddTimeLogForm({ params }) {
    const [duration, setDuration] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await addTimeLog({});
            setDuration(0); // Resetowanie formularza
            setError(null); // Resetowanie błędu
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania logu czasu.";
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold">Dodaj log czasu</h3>

            <div>
                <label htmlFor="duration" className="block text-gray-700">Czas pracy (w godzinach):</label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={1}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
                Dodaj log
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
    );
}
