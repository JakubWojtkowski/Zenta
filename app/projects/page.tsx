import { createProject } from "@/actions/actions";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany();


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <h1 className="text-3xl font-bold">
        All projects ({projects.length}):
      </h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`projects/${project.slug}`}
              className="text-blue-500">
              {project.title}
            </Link>
          </li>
        ))}
      </ul>

      <form
        action={createProject}
        className="flex flex-col gap-y-2 w-[300px] my-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="px-2 py-1 rounded-sm"
        />
        {/* <textarea
          name="content"
          rows={5}
          placeholder="Content"
          className="px-2 py-1 rounded-sm"
        /> */}
        <button
          type="submit"
          className="bg-blue-500 py-2 text-white rounded-sm"
        >Create Project</button>
      </form>
    </div>
  );
}
