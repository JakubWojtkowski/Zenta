import prisma from "@/lib/db";
import { createTask } from "@/actions/actions";

export default async function ProjectPage({ params }) {
    // Oczekiwanie na params, aby uzyskać slug
    const { slug } = await params; // Oczekiwanie na params

    // Pobranie projektu oraz zadań
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        include: {
            members: {
                include: {
                    user: true, // Ładowanie użytkowników w członkach projektu
                },
            },
            tasks: {
                include: {
                    assignee: true, // Ładowanie przypisanych użytkowników do zadań
                },
            },
        },
    });


    return (
        <div className="flex flex-col items-center gap-y-5 pt-24 text-center">
            <h1 className="text-3xl font-semibold">{project?.title}</h1>
            <p>{project?.content}</p>

            {/* Wyświetlanie zadań */}
            <div className="w-full">
                <h2 className="text-2xl font-semibold">Tasks</h2>
                {project?.tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {project?.tasks.map((task) => (
                            <li key={task.id}>
                                <strong>{task.taskName}</strong> - {task.status} (Priority: {task.priority} {task.assignee && <span> - Assigned to: {task.assignee.username}</span>} {/* Imię przypisanego użytkownika */})

                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Formularz tworzenia nowego zadania */}
            <form action={createTask} className="flex flex-col gap-y-2">
                {/* Ukryte pole z ID projektu */}
                <input type="hidden" name="projectId" value={project?.id} />

                <input
                    type="text"
                    name="taskName"
                    placeholder="Task Name"
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    rows={4}
                    className="border p-2 rounded"
                />

                {/* Priorytet zadania */}
                <select name="priority" className="border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>

                {/* Lista członków do przypisania zadania */}
                <select name="assignedTo" className="border p-2 rounded">
                    {project?.members.map((member) => (
                        <option key={member.user.id} value={member.user.id}>
                            {member.user.username}
                        </option>
                    ))}
                </select>

                {/* Szacowany czas wykonania */}
                <input
                    type="number"
                    name="timeEstimate"
                    placeholder="Estimated Time (minutes)"
                    className="border p-2 rounded"
                />

                {/* Szacowane punkty trudności */}
                <input
                    type="number"
                    name="estimatedPoints"
                    placeholder="Estimated Points"
                    className="border p-2 rounded"
                />

                <button type="submit" className="bg-blue-500 text-white py-2 rounded">
                    Add Task
                </button>
            </form>
        </div>
    );
}
