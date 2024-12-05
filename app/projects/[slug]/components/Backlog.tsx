import prisma from "@/lib/db";
import { AddNewTaskForm } from "./AddNewTaskForm";
import { EllipsisVertical } from "lucide-react";
import { generateAvatar } from "@/actions/users";
import AddUserToTask from "./AddUserToTask";


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
                include: {
                    assignee: true, // Pobieranie przypisanego użytkownika do zadania
                },
            },
            members: {
                include: {
                    user: true, // Pobieranie danych użytkowników związanych z członkami projektu
                },
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
            <h2 className="text-xl font-semibold mb-4">
                Backlog <span className="text-lg text-gray-400">({project.tasks.length} tasks)</span>
            </h2>

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

                                {/* Awatar, Priorytet, termin i inne informacje */}
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
                                    {/* Awatar użytkownika */}
                                    <div className="flex items-center">
                                        {task.assignee ? (
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold"
                                                title={task.assignee.username}
                                            >
                                                <span className="text-gray-600">{generateAvatar(task.assignee.username)}</span>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 font-bold"
                                                title="Unassigned"
                                            >
                                                --
                                            </div>
                                        )}
                                        {project?.members && (
                                            <>
                                                <AddUserToTask taskId={task.id.toString()} projectId={project.id.toString()} />
                                            </>

                                        )}
                                    </div>

                                    {/* Priorytet */}
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${task.priority === "HIGH"
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
