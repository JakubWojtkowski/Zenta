import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { createProject } from "@/actions/projects";
import { addMemberToProject, generateAvatar } from "@/actions/users";

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

    const allUsers = await prisma.user.findMany({
        where: { email: { not: session.user?.email } },
    });

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="flex-[0.8] grid items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold">List of your projects ({user.projects.length}):</h1>

            <table className="table-auto border-collapse border border-gray-400 w-full sm:w-full mb-8">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="border border-gray-300 px-6 py-4">ID</th>
                        <th className="border border-gray-300 px-6 py-4">Project Name</th>
                        <th className="border border-gray-300 px-6 py-4">Completed</th>
                        <th className="border border-gray-300 px-6 py-4">Author</th>
                        <th className="border border-gray-300 px-6 py-4">Members</th>
                        <th className="border border-gray-300 px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {user.projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-6 py-4">{project.id.toString().slice(0, 6)}</td>
                            <td className="border border-gray-300 px-6 py-4">
                                <Link href={`projects/${project.slug}`} className="text-blue-500 hover:underline">
                                    {project.title}
                                </Link>
                            </td>
                            <td className="border border-gray-300 px-6 py-4">
                                {project.completed ? "Yes" : "No"}
                            </td>
                            <td className="border border-gray-300 px-6 py-4">
                                {project.author ? project.author.username : "Unknown"}
                            </td>
                            <td className="border border-gray-300 px-6 py-4 flex items-center">
                                {project.members.slice(0, 3).map((member) => (
                                    <div key={member.user.id} className="ml-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center">
                                        {generateAvatar(member.user.username)}
                                    </div>
                                ))}
                                {project.members.length > 3 && (
                                    <button className="ml-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center">
                                        +
                                    </button>
                                )}
                            </td>
                            {/* Kolumna Actions z przyciskami Edit i Delete */}
                            <td className="border border-gray-300 px-6 py-4 flex items-center space-x-4">
                                <Link
                                    href={`/projects/edit/${project.id}`}
                                    className="text-blue-500 hover:underline p-2 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200"
                                >
                                    Edit
                                </Link>
                                <button className="text-red-500 hover:underline p-2 bg-red-100 rounded-md hover:bg-red-200 transition duration-200">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Formularz do dodawania członków do projektu */}
            <form action={addMemberToProject} className="flex flex-col gap-y-2 sm:w-[420px] w-[300px] my-4">
                <select name="projectId" className="px-2 py-1 rounded-sm border border-gray-600" required>
                    <option value="">Select Project</option>
                    {user.projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.title}
                        </option>
                    ))}
                </select>

                <select name="userId" className="px-2 py-1 rounded-sm border border-gray-600" required>
                    <option value="">Select User</option>
                    {allUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>

                <button type="submit" className="bg-blue-500 py-2 text-white rounded-sm border border-gray-600 hover:bg-blue-600">
                    Add Member
                </button>
            </form>

            {/* Formularz tworzenia projektu */}
            <form action={createProject} className="flex flex-col gap-y-2 sm:w-[420px] w-[300px] my-4">
                <input type="text" name="title" placeholder="Title" className="px-2 py-1 rounded-sm border border-gray-600" />
                <textarea name="content" rows={5} placeholder="Description" className="px-2 py-1 rounded-sm border border-gray-600" />
                <button type="submit" className="bg-blue-500 py-2 text-white rounded-sm border border-gray-600 hover:bg-blue-600">
                    Create Project
                </button>
            </form>
        </div>
    );
}
