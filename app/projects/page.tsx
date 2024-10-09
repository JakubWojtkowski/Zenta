import { addProject } from "@/actions/actions";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany(
    // {
  //   where: {
  //     title: {
  //       endsWith: "task",
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     slug: true,
  //   },
  //   // take: 10,
  //   // skip: 10,
  // }
  );

  // const projectsCount = await prisma.project.count();

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

      {/* <form action={addProject} className="space-x-2 h-4">
        <input type="text" name="title" className="px-3 py-1 rounded" />
        <button
          type="submit" className="bg-blue-500 px-3 py-1 text-white rounded"
        >
          Add project
        </button>
      </form> */}
    </div>
  );
}
