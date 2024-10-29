import { createProject, deleteProject } from "@/actions/actions"; // Zakładam, że masz te akcje
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image"; // Użyjemy do wyświetlania avatarów

export default async function ProjectsPage() {
  // Pobierz dane użytkownika i projekty
  const user = await prisma.user.findUnique({
    where: { email: "john@gmail.com" },
    include: {
      projects: {
        include: {
          author: true, // Pobierz szczegóły autora
          members: { // Pobierz przypisanych członków projektu
            include: { user: true }, // Pobierz dane użytkowników (członków)
          },
        },
      },
    },
  });

  return (
    <div className="flex-[0.8] grid items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">
        List of your projects ({user?.projects.length}):
      </h1>

      {/* Tabela projektów */}
      <table className="table-auto border-collapse border border-gray-400 w-full sm:w-3/4 mb-8">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Completed</th>
            <th className="border border-gray-300 px-4 py-2">Author</th>
            <th className="border border-gray-300 px-4 py-2">Members</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
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
              <td className="border border-gray-300 px-4 py-2 flex items-center">
                {/* Wyświetlanie avatarów członków */}
                {project.members.map((member) => (
                  <Image
                    key={member.user.id}
                    src={`/avatars/${member.user.id}.png`} // Zakładam, że masz obrazy avatarów
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
                {/* Przycisk edit */}
                <Link href={`/projects/edit/${project.id}`} className="text-blue-500 hover:underline mr-2">
                  Edit
                </Link>
                {/* Przycisk delete */}
                <button
                  // onClick={async () => {
                  //   await deleteProject(project.id); // Musisz stworzyć funkcję delete
                  //   location.reload(); // Odśwież stronę po usunięciu
                  // }}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz tworzenia projektu */}
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
