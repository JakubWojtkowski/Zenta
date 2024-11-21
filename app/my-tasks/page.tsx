import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function MyTasksPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <div>Please log in to view your tasks.</div>;
    }

    const tasks = await prisma.task.findMany({
        where: { assignedTo: session.user?.id },
        include: { project: true },
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
            {tasks.length === 0 ? (
                <p>No tasks assigned yet.</p>
            ) : (
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li key={task.id} className="p-4 bg-gray-100 rounded-md">
                            <h2 className="font-bold">{task.taskName}</h2>
                            <p>Project: {task.project.title}</p>
                            <p>Due Date: {task.deadline?.toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
