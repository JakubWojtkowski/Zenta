import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
// import { addMemberToProject, generateAvatar } from "@/actions/users";
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
                    </tr>
                </thead>
                <tbody>
                    {user.projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{project.id.toString().slice(0, 6)}</td>
                            <td className="px-6 py-4">
                                <Link href={`projects/${project.slug}`} className="text-blue-400 hover:underline">
                                    {project.title}
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                {project.author?.username || "Unknown"}
                            </td>
                            <td className="px-6 py-4">
                                {project.members.map((member) => member.user.username).join(", ")}
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
