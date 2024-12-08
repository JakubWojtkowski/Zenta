import prisma from "@/lib/db";
import KanbanBoard from "../../projects/[slug]/components/KanbanBoard"; // Zakładam, że masz taki komponent
import { notFound } from "next/navigation";
import EndSprintButton from "./components/EndSprintButton";

export default async function SprintPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Pobranie sprintu z bazy danych
    const sprint = await prisma.sprint.findUnique({
        where: { id },
        include: {
            tasks: true, // Pobranie zadań przypisanych do sprintu
            project: true, // Pobranie danych projektu dla poprawnego wyświetlenia
        },
    });

    // Obsługa przypadku, gdy sprint nie istnieje
    if (!sprint) {
        notFound(); // Zwraca 404, jeśli sprint nie istnieje
    }

    const { name, startDate, endDate, tasks, project } = sprint;

    return (
        <div className="container mx-auto px-4 sm:px-20 sm:py-10">
            {/* Nagłówek nawigacyjny */}
            <div className="text-center mb-12 flex gap-1 text-gray-400 font-bold text-sm tracking-wide">
                <a href={`/projects/${project.id}`} className="hover:text-gray-600">
                    {project.title}
                </a>
                <span>/</span>
                <span>Sprint: {name}</span>
            </div>

            {/* Sekcja szczegółów sprintu */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">Sprint: {name}</h2>
                    <EndSprintButton />
                </div>

                <div className="text-gray-400">
                    <p>
                        {startDate
                            ? `Start: ${new Date(startDate).toLocaleDateString("en-GB")}`
                            : "Brak daty rozpoczęcia"}
                    </p>
                    <p>
                        {endDate
                            ? `End: ${new Date(endDate).toLocaleDateString("en-GB")}`
                            : "Brak daty zakończenia"}
                    </p>
                </div>

                {/* Tablica Kanban z zadaniami sprintu */}
                <KanbanBoard tasks={tasks} />
            </div>
        </div>
    );
}
