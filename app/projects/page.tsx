import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/auth"; 
import prisma from "@/lib/db"; 
import Link from "next/link"; 
import Image from "next/image"; 
import { createProject } from "@/actions/projects"; 
import { addMemberToProject } from "@/actions/users"; 

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
        where: { email: { not: session.user?.email } }, // Wyklucz obecnego użytkownika 
    });

    if (!user) { 
        return <div>User not found.</div>; 
    }

    return ( 
        <div className="flex-[0.8] grid items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"> 
            <h1 className="text-3xl font-bold">List of your projects ({user.projects.length}):</h1>

            <table className="table-auto border-collapse border border-gray-400 w-full sm:w-3/4 mb-8"> 
                <thead className="bg-gray-200 text-gray-700"> 
                    <tr> 
                        <th className="border border-gray-300 px-4 py-2">ID</th> 
                        <th className="border border-gray-300 px-4 py-2">Title</th> 
                        <th className="border border-gray-300 px-4 py-2">Created at</th> 
                        <th className="border border-gray-300 px-4 py-2">Completed</th> 
                        <th className="border border-gray-300 px-4 py-2">Author</th> 
                        <th className="border border-gray-300 px-4 py-2">Members</th> 
                        <th className="border border-gray-300 px-4 py-2">Actions</th> 
                    </tr> 
                </thead> 
                <tbody> 
                    {user.projects.map((project) => ( 
                        <tr key={project.id} className="hover:bg-gray-100"> 
                            <td className="border border-gray-300 px-4 py-2">{project.id}</td> 
                            <td className="border border-gray-300 px-4 py-2"> 
                                <Link href={`projects/${project.slug}`} className="text-blue-500 hover:underline"> 
                                    {project.title} 
                                </Link> 
                            </td> 
                            <td className="border border-gray-300 px-4 py-2"> 
                                {new Date(project.createdAt).toLocaleDateString()} 
                            </td> 
                            <td className="border border-gray-300 px-4 py-2"> 
                                {project.completed ? "Yes" : "No"} 
                            </td> 
                            <td className="border border-gray-300 px-4 py-2"> 
                                {project.author ? project.author.username : "Unknown"} 
                            </td> 
                            <td className="border border-gray-300 px-4 py-2 flex items-center"> 
                                {project.members.map((member) => ( 
                                    <Image 
                                        key={member.user.id} 
                                        src={`/avatars/${member.user.id}.png`} 
                                        alt={member.user.username} 
                                        width={30} 
                                        height={30} 
                                        className="rounded-full mr-2" 
                                    /> 
                                ))} 
                                {/* Przycisk do dodania członka */} 
                                <button className="ml-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"> 
                                    + 
                                </button> 
                            </td> 
                            <td className="border border-gray-300 px-4 py-2"> 
                                <Link href={`/projects/edit/${project.id}`} className="text-blue-500 hover:underline mr-2"> 
                                    Edit 
                                </Link> 
                                <button className="text-red-500 hover:underline"> 
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
