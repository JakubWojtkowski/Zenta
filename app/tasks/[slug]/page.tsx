import prisma from "@/lib/db";
import { AddTimeLogForm } from "./components/AddTimeLogForm";
import { getPriorityColor, getStatusColor } from "@/lib/getColor";
import TimeLogChart from './components/TimeLogChart'

export default async function TaskPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Pobranie zadania z bazy danych
    const task = await prisma.task.findUnique({
        where: { id: slug },
        include: {
            assignee: true,
            project: true,
            TimeLog: true,
        },
    });

    // Obsługa przypadku, gdy zadanie nie istnieje
    if (!task) {
        return (
            <div className="container mx-auto px-4 pt-12">
                <h1 className="text-2xl font-bold text-gray-900">Zadanie nie znalezione</h1>
                <p className="text-gray-700 mt-2">
                    Nie udało się znaleźć zadania o podanym ID: <strong>{slug}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">{task.taskName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Data dodania: {new Date(task.createdAt).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
                <p className="text-lg text-gray-700 mt-2">{task.description}</p>

                <div className="text-md mt-2 flex items-center justify-center gap-2">
                    <strong>Priorytet:</strong>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`} > {task.priority}</span>
                </div>
                <div className="text-md mt-2 flex items-center justify-center gap-2">
                    <strong>Status:</strong>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}}`}>{task.status}</span>
                </div>
                <p className="text-md mt-2">
                    Przypisane do: {task.assignee ? task.assignee.username : "Nieprzypisane"}
                </p>
            </div >

            {/* Logi czasu */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Logi czasu</h2>
                {task.TimeLog.length === 0 ? (
                    <p className="text-gray-600 mt-2">Brak logów czasu dla tego zadania.</p>
                ) : (
                    <div className="p-6 bg-white rounded-lg shadow-md mt-4">
                        <TimeLogChart timeLogs={task.TimeLog} />
                    </div>
                )}
            </div>

            {/* Formularz do dodania nowego wpisu TimeLog */}
            < AddTimeLogForm task={{ id: task.id, taskName: task.taskName }
            } />
        </div >
    );
}
