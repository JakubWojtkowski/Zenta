import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { addMemberToProject, generateAvatar } from "@/actions/users";
import AddNewProject from "./components/AddNewProject";


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
        <div className="flex flex-col gap-16 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold">
                Your projects <span className="text-gray-400 text-2xl">({user.projects.length})</span>
            </h1>

            {/* Tabela z dostosowanymi stylami */}
            <table className="table-auto w-full mb-8">
                <thead className="text-left">
                    <tr className="bg-gray-100">
                        <th className="px-6 py-4 text-gray-700 font-medium">ID</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Project Name</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Completed</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Author</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Members</th>
                        <th className="px-6 py-4 text-gray-700 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {user.projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                            {/* Kolumna ID */}
                            <td className="px-6 py-4 text-left">{project.id.toString().slice(0, 6)}</td>

                            {/* Kolumna Project Name */}
                            <td className="px-6 py-4 text-left">
                                <Link href={`projects/${project.slug}`} className="text-blue-400 hover:underline">
                                    {project.title}
                                </Link>
                            </td>

                            {/* Kolumna Completed */}
                            <td className="px-6 py-4 text-left">
                                {project.completed ? "Yes" : "No"}
                            </td>

                            {/* Kolumna Author */}
                            <td className="px-6 py-4 text-left">
                                <span className="border border-1 border-green-400 bg-green-100 p-2 text-green-400">
                                    {project.author ? project.author.username : "Unknown"}
                                </span>
                            </td>

                            {/* Kolumna Members */}
                            <td className="px-6 py-4 text-left flex items-center">
                                {project.members.slice(0, 3).map((member) => (
                                    <div
                                        key={member.user.id}
                                        className="ml-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                                    >
                                        {generateAvatar(member.user.username)}
                                    </div>
                                ))}
                                {project.members.length > 3 && (
                                    <button className="ml-2 w-8 h-8 rounded-full flex items-center justify-center bg-orange-200 text-orange-500">
                                        + {project.members.length - 3}
                                    </button>
                                )}
                            </td>

                            {/* Kolumna Actions */}
                            <td className="px-6 py-4 text-left">
                                <div className="flex flex-row gap-2">
                                    <Link
                                        href={`/projects/edit/${project.id}`}
                                        className="text-blue-500 p-2 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200 text-center"
                                    >
                                        Edit
                                    </Link>
                                    <button className="text-red-500 p-2 bg-red-100 rounded-md hover:bg-red-200 transition duration-200 text-center">
                                        Delete
                                    </button>
                                </div>
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
            <AddNewProject />
        </div>
    );
}
