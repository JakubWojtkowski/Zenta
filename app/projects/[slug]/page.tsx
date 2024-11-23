// import Link from "next/link";
import prisma from "@/lib/db";
import { AddNewTaskForm } from "../[slug]/components/AddNewTaskForm";
// import { generateAvatar } from "@/actions/users";
import { HouseIcon, SlashIcon } from "lucide-react";
// import { getPriorityColor, getStatusColor } from "@/lib/getColor";
import KanbanBoard from "./components/KanbanBoard";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Pobranie projektu oraz zadań
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            tasks: {
                include: {
                    assignee: true,
                },
            },
        },
    });

    // Obsługa przypadku, gdy projekt nie istnieje
    if (!project) {
        return (
            <div className="container mx-auto px-4 pt-12">
                <h1 className="text-2xl font-bold text-gray-900">Projekt nie znaleziony</h1>
                <p className="text-gray-700 mt-2">
                    Nie udało się znaleźć projektu o podanym ID: <strong>{slug}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-20 sm:py-10">
            {/* Ścieżka */}
            <div className="text-center mb-12 flex gap-1 text-gray-400 font-bold text-sm tracking-wide">
                <HouseIcon />
                <SlashIcon />
                <span>Projects</span>
                <SlashIcon />
                <span>{project.title}</span>
                <SlashIcon />
                <span className="text-gray-600">Kanban Board</span>
            </div>

            {/* Wyświetlanie zadań */}
            <div className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">{project.title}</h2>
                <p className="text-gray-400">
                    {project.createdAt
                        ? `${new Date(project.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                        })} ${new Date(project.createdAt).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}`
                        : "Brak daty początkowej"}
                </p>
                {project.tasks.length === 0 ? (
                    <p className="text-gray-600 mt-2">No tasks available.</p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <div className="mt-4">
                            <KanbanBoard
                                tasks={project.tasks.map((task) => ({
                                    ...task,
                                    description: task.description ?? undefined, // Zmiana null na undefined
                                }))}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Formularz dodawania zadania */}
            <AddNewTaskForm project={project} />
        </div>
    );
}
