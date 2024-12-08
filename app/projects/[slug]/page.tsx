import prisma from "@/lib/db";
import { HouseIcon, SlashIcon, SearchIcon } from "lucide-react";
import BacklogPage from "./components/Backlog";
import { generateAvatar } from "@/actions/users";
import AddSprintForm from "./components/AddSprintForm";
import Link from "next/link"; // Zaimportowanie Linka

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Pobranie projektu, sprintów i zadań
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
            sprints: true, // Pobranie sprintów przypisanych do projektu
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
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
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
                    </div>

                    {/* Pasek narzędzi */}
                    <div className="flex items-center gap-4">
                        {/* Pole wyszukiwania */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                            <SearchIcon className="absolute left-2 top-2.5 text-gray-500 w-5 h-5" />
                        </div>

                        <AddSprintForm
                            projectId={project.id}
                            backlogTasks={project.tasks}
                        />

                        {/* Avatary użytkowników */}
                        <div className="flex -space-x-2">
                            {project.members.map((member) => (
                                <div key={member.user.id} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold">
                                    <span className="text-gray-600">{generateAvatar(member.user.username)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Filtry */}
                        <button className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                            Only my issues
                        </button>
                        <button className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                            Recently Updated
                        </button>
                    </div>
                </div>

                {/* Sekcja Sprintów */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">Sprints</h3>
                    <ul className="mt-4 space-y-2">
                        {project.sprints.map((sprint) => (
                            <li key={sprint.id}>
                                <Link
                                    href={`/sprint/${sprint.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {sprint.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Przekazanie projectId do BacklogPage */}
                <BacklogPage projectId={project.id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                </div>
            </div>
        </div>
    );
}
