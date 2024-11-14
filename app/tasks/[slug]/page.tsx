import prisma from "@/lib/db";
import { AddTimeLogForm } from "./components/AddTimeLogForm";

function getPriorityColor(priority: string): string {
    if (priority === "HIGH") return "bg-red-400 text-white";
    if (priority === "MEDIUM") return "bg-yellow-400 text-white";
    if (priority === "LOW") return "bg-green-400 text-white";
    return "bg-gray-200 text-gray";
}

function getStatusColor(status: string): string {
    if (status === "TODO") return "bg-blue-400 text-white";
    if (status === "IN_PROGRESS") return "bg-yellow-600 text-white";
    if (status === "DONE") return "bg-green-600 text-white";
    return "bg-gray-200 text-gray-700";
}

export default async function TaskPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const task = await prisma.task.findUnique({
        where: { id: slug },
        include: {
            assignee: true,
            project: true,
            TimeLog: true,
        },
    });

    if (!task) {
        return <div>Zadanie o podanym ID nie zostało znalezione.</div>;
    }

    return (
        <div className="container mx-auto px-4 pt-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">{task.taskName}</h1>
                <p className="text-lg text-gray-700 mt-2">{task.description}</p>

                {/* Status zadania z kolorem */}
                <p className="text-md mt-2">
                    Status:{" "}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}
                    >
                        {task.status}
                    </span>
                </p>

                {/* Priorytet zadania z kolorem */}
                <p className="text-md mt-2">
                    Priorytet:{" "}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}
                    >
                        {task.priority}
                    </span>
                </p>

                <p className="text-md text-gray-600 mt-2">
                    Przypisane do: {task.assignee ? task.assignee.username : "Nieprzypisane"}
                </p>
            </div>

            {/* Wyświetlenie logów czasu dla tego zadania */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Logi czasu</h2>
                {task.TimeLog.length === 0 ? (
                    <p className="text-gray-600 mt-2">Brak logów czasu dla tego zadania.</p>
                ) : (
                    <ul className="mt-4">
                        {task.TimeLog.map((log) => (
                            <li key={log.id} className="border-b py-2">
                                {log.duration} minut
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Formularz do dodania nowego wpisu TimeLog */}
            <AddTimeLogForm task={task} />
        </div>
    );
}
