import { createProject } from "@/actions/actions";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function ProjectsPage() {
  // Fetch the user and include their projects with the author's info
  const user = await prisma.user.findUnique({
    where: {
      email: "john@gmail.com",
    },
    include: {
      projects: {
        include: {
          author: true, // Fetch author details of each project
        },
      },
    },
  });

  return (
    <div className="flex-[0.8] grid items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">
        List of your projects ({user?.projects.length}):
      </h1>

      {/* Project Table */}
      <table className="table-auto border-collapse border border-gray-400 w-full sm:w-3/4 mb-8">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Completed</th>
            <th className="border border-gray-300 px-4 py-2">Author</th>
          </tr>
        </thead>
        <tbody>
          {user?.projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{project.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link href={`projects/${project.slug}`} className="text-blue-500 hover:underline">
                  {project.title}
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {project.completed ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {project.author ? project.author.username : "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Project Form */}
      <form
        action={createProject}
        className="flex flex-col gap-y-2 sm:w-[420px] w-[300px] my-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="px-2 py-1 rounded-sm border border-gray-600"
        />
        <textarea
          name="content"
          rows={5}
          placeholder="Description"
          className="px-2 py-1 rounded-sm border border-gray-600"
        />
        <button
          type="submit"
          className="bg-blue-500 py-2 text-white rounded-sm border border-gray-600 hover:bg-blue-600"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
