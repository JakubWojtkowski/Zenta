import prisma from "@/lib/db";
import { AddNewTaskForm } from "../[slug]/components/AddNewTaskForm";

export default async function ProjectPage({ params }) {
    const { slug } = await params;

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

    return (
        <div className="container mx-auto px-4 pt-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900">{project?.title}</h1>
                <p className="text-lg text-gray-700 mt-2">{project?.content}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Tasks</h2>
                {project?.tasks.length === 0 ? (
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
                                </tr>
                            </thead>
                            <tbody>
                                {project?.tasks.map((task) => (
                                    <tr key={task.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{task.taskName}</td>
                                        <td className="py-3 px-4">{task.priority}</td>
                                        <td className="py-3 px-4">{task.status}</td>
                                        <td className="py-3 px-4">
                                            {task.assignee ? task.assignee.username : "Unassigned"}
                                        </td>
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
