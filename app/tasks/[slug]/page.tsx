import prisma from "@/lib/db";
import { AddTimeLogForm } from "./components/AddTimeLogForm";
import TimeLogChart from './components/TimeLogChart';

export default async function TaskPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Pobranie zadania z bazy danych
    const task = await prisma.task.findUnique({
        where: { id: slug },
        include: {
            assignee: true,
            project: true,
            TimeLog: {
                include: { user: true }
            }
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

                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-1 items-start flex-1">
                        <h1 className="text-4xl font-bold text-gray-900">{task.taskName}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Data dodania: {new Date(task.createdAt).toLocaleDateString("pl-PL", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <p className="text-gray-700 mt-2 flex-1">Description: {task.description}</p>



                        <div className="text-md mt-2 flex items-center justify-center gap-2">
                            <span
                                className={`text-xs font-bold w-[70px] flex items-center justify-center py-1 rounded-full ${task.priority === "HIGH"
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
                            <span
                                className={`text-xs font-bold w-[70px] flex items-center justify-center py-1 rounded-full ${task.status === "TODO"
                                    ? "bg-blue-100 text-blue-600"
                                    : task.status === "IN_PROGRESS"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : task.status === "DONE"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {task.status}
                            </span>
                        </div >
                    </div>

                    {/* Formularz do dodania nowego wpisu TimeLog */}
                    < AddTimeLogForm task={{ id: task.id, taskName: task.taskName }
                    } />
                </div>
                {/* Logi czasu */}
                <div className="mt-6">
                    {task.TimeLog.length === 0 ? (
                        <p className="text-gray-600 mt-2">Brak logów czasu dla tego zadania.</p>
                    ) : (
                        <>
                            <div className="p-6 bg-white rounded-lg shadow-md mt-4">
                                <h2 className="text-xl font-bold">Wykresy czasu</h2>
                                <TimeLogChart timeLogs={task.TimeLog} />
                            </div>
                        </>
                    )}
                </div>


            </div >
        </div>
    );
}
