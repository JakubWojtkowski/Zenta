import { Project } from "@prisma/client";
import { createTask } from "@/actions/tasks";

interface AddNewTaskFormProps {
    project: Project & { members?: { user: { id: string; username: string } }[] }; // Uwzględnione opcjonalne pole members
}

export const AddNewTaskForm = ({ project }: AddNewTaskFormProps) => {
    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Task</h3>

            <form action={createTask} className="space-y-4">
                <input type="hidden" name="projectId" value={project?.id} />

                <div>
                    <input
                        type="text"
                        name="taskName"
                        placeholder="Task Name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                        minLength={3} // Minimalna długość nazwy zadania
                    />
                </div>

                <div>
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                        minLength={10} // Minimalna długość opisu
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <select
                            name="priority"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <select
                            name="assignedTo"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                            disabled={!project.members || project.members.length === 0} // Wyłącz, jeśli brak członków
                        >
                            {project?.members?.map((member) => (
                                <option key={member.user.id} value={member.user.id}>
                                    {member.user.username}
                                </option>
                            )) || (
                                    <option value="">No members available</option> // Komunikat, gdy brak członków
                                )}
                        </select>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <input
                            type="number"
                            name="timeEstimate"
                            placeholder="Estimated Time (minutes)"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                            min={1} // Minimalna wartość dla szacowanego czasu
                        />
                    </div>
                    <div className="w-1/2">
                        <input
                            type="number"
                            name="estimatedPoints"
                            placeholder="Estimated Points"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                            min={1} // Minimalna wartość dla szacowanych punktów
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Add Task
                </button>
            </form>
        </div>
    );
};
