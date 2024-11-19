import Link from "next/link";
import prisma from "@/lib/db";
import { AddNewTaskForm } from "../[slug]/components/AddNewTaskForm";
import { generateAvatar } from "@/actions/users";
import { getPriorityColor, getStatusColor } from "@/lib/getColor";

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
        <div className="container mx-auto px-4 pt-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-lg text-gray-700 mt-2">{project.content}</p>
            </div>

            {/* Wyświetlanie zadań */}
            <div className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Tasks</h2>
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
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="border-b bg-gray-100">
                                    <th className="py-3 px-4 text-left text-gray-600">Task Name</th>
                                    <th className="py-3 px-4 text-left text-gray-600">Priority</th>
                                    <th className="py-3 px-4 text-left text-gray-600">Status</th>
                                    <th className="py-3 px-4 text-left text-gray-600">Assigned To</th>
                                    <th className="py-3 px-4 text-left text-gray-600">Estimated points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.tasks.map((task) => (
                                    <tr key={task.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                                                {task.taskName}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 flex items-center gap-2">
                                            {task.assignee ? (
                                                <div
                                                    key={task.assignee.id}
                                                    className="ml-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                                                >
                                                    {generateAvatar(task.assignee.username)}
                                                </div>
                                            ) : (
                                                <span>Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{task.estimatedPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Formularz dodawania zadania */}
            <AddNewTaskForm project={project} />
        </div>
    );
}
