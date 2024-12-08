"use client";

import { useState } from "react";
import { addTimeLog } from "@/actions/tasks";
import { PlusIcon } from "lucide-react";

export function AddTimeLogForm({ task }: { task: { id: string; taskName: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const toggleModal = () => setIsOpen((prev) => !prev);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await addTimeLog({ taskId: task.id, duration });
            setDuration(0); // Resetowanie formularza
            setError(null); // Resetowanie błędu
            toggleModal(); // Zamknięcie modal po sukcesie
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania logu czasu.";
            setError(errorMessage);
        }
    };

    return (
        <>
            {/* Przycisk otwierający modal */}
            <button
                onClick={toggleModal}
                className="text-blue-400 text-sm font-semibold px-4 rounded-md transition flex gap-2 hover:text-blue-500"
            >
                <PlusIcon size={18} /> Dodaj log czasu
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Tło przyciemniające */}
                    <div
                        onClick={toggleModal}
                        className="flex-1 bg-black bg-opacity-50"
                    ></div>

                    {/* Zawartość modal */}
                    <div className="w-1/3 bg-white shadow-lg p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold text-gray-800">Dodaj log czasu</h3>
                            <button
                                onClick={toggleModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-gray-700">
                                Dodajesz log czasu dla: <strong>{task.taskName}</strong>
                            </p>

                            <div>
                                <label
                                    htmlFor="duration"
                                    className="block text-gray-700 font-medium"
                                >
                                    Czas pracy (w minutach):
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={1}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Przycisk zapisu */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Dodaj log
                            </button>

                            {/* Wyświetlanie błędu */}
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
