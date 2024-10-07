import { addTask } from "@/actions/actions";
import prisma from "@/lib/db";
import { Key } from "react";

export default async function Home() {

  const tasks = await prisma.task.findMany();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <h1 className="text-3xl font-bold underline">
        All tasks:
      </h1>
      <ul>
        {tasks.map((task: { id: Key | null | undefined; title: string | number | bigint | boolean | null | undefined; }) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>

      <form action={addTask} className="space-x-2 h-4">
        <input type="text" name="title" className="px-3 py-1 rounded" />
        <button
          type="submit" className="bg-blue-500 px-3 py-1 text-white rounded"
        >
          Add task
        </button>
      </form>
    </div>
  );
}
