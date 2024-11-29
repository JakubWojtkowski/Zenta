import prisma from "@/lib/db";
import { AddNewTaskForm } from "./AddNewTaskForm";
import { EllipsisVertical } from "lucide-react";

interface BacklogPageProps {
    projectId: string; // Poprawnie określony typ przekazanej właściwości
}

export default async function BacklogPage({ projectId }: BacklogPageProps) {
    // Pobranie projektu i zadań
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            tasks: {
                where: { sprintId: null }, // Zadania bez przypisanego sprintu
            },
        },
    });

    // Obsługa przypadku, gdy projekt nie istnieje
    if (!project) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Project not found</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold mb-4">Backlog <span className="text-lg text-gray-400">({project.tasks.length} tasks)</span></h2>

            {/* Wyświetlanie zadań w backlogu */}
            <div>
                {project.tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks in the backlog.</p>
                ) : (
                    <div className="space-y-4">
                        {project.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 border rounded-lg bg-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                            >
                                {/* Nazwa i opis zadania */}
                                <div>
                                    <h3 className="font-semibold text-gray-700">{task.taskName}</h3>
                                </div>

                                {/* Priorytet, termin i inne informacje */}
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${task.priority === "HIGH"
                                            ? "bg-red-100 text-red-600"
                                            : task.priority === "MEDIUM"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : task.priority === "LOW"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {task.priority}
                                    </span>
                                    <EllipsisVertical className="text-blue-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sekcja dodawania nowych zadań */}
            <div className="mt-8">
                <AddNewTaskForm project={project} />
            </div>
        </div>
    );
}
