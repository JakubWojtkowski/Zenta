import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { generateAvatar } from "@/actions/users";
import AddNewProject from "./components/AddNewProject";
import EditProject from "./components/EditProject"; // Zmieniamy nazwę na EditProjectModal
import AddUserToProject from "./components/AddUserToProject";

export default async function ProjectsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div>
                <h1>Please log in to view your projects.</h1>
            </div>
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
        include: {
            projects: {
                include: {
                    author: true,
                    members: {
                        include: { user: true },
                    },
                },
            },
        },
    });

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="flex flex-col gap-16 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold">
                Your projects <span className="text-gray-400 text-2xl">({user.projects.length})</span>
            </h1>

            {/* Project List */}
            <table className="table-auto w-full mb-8">
                <thead className="text-left">
                    <tr className="bg-gray-100">
                        <th className="px-6 py-4 text-gray-700 font-medium">ID</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Project Name</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Author</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Members</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Actions</th> {/* Nowa kolumna na akcje */}
                    </tr>
                </thead>
                <tbody>
                    {user.projects?.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{project.id.toString().slice(0, 6)}</td>
                            <td className="px-6 py-4">
                                <Link href={`projects/${project.slug}`} className="text-blue-400 hover:underline">
                                    {project.title}
                                </Link>
                            </td>
                            <td className="px-6 py-4 flex">
                                <div className="border border-green-300 rounded p-1 bg-green-100 text-green-400 ">{project.author?.username || "Unknown"}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {project?.members.slice(0, 3).map((member) => (
                                        <div
                                            key={member.user.id}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold"
                                        >
                                            <span className="text-gray-600">{generateAvatar(member.user.username)}</span>
                                        </div>
                                    ))}
                                    {project?.members && (
                                        <>
                                            <AddUserToProject
                                                projectId={project.id.toString()}
                                                initialTitle={project.title ?? ""}
                                                initialContent={project.content ?? ""}
                                            />
                                        </>

                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 flex gap-4">
                                <EditProject
                                    projectId={project.id.toString()}
                                    initialTitle={project.title ?? ""}
                                    initialContent={project.content ?? ""}
                                />
                                <Link
                                    href={`/projects/delete/${project.id}`}
                                    className="text-sm text-red-400 bg-red-50 p-2 rounded-md"
                                >
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add New Project Button */}
            <AddNewProject />
        </div>
    );
}
