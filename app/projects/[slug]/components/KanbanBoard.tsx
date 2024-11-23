"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { updateTask } from "@/actions/tasks";
import { Task } from "@/types/types";

interface KanbanBoardProps {
    tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    const [columns, setColumns] = React.useState<{
        BACKLOG: Task[];
        TODO: Task[];
        IN_PROGRESS: Task[];
        DONE: Task[];
    }>(() => ({
        BACKLOG: tasks.filter((task) => task.status === "BACKLOG"),
        TODO: tasks.filter((task) => task.status === "TODO"),
        IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
        DONE: tasks.filter((task) => task.status === "DONE"),
    }));

    const onDragEnd = async (result: DropResult) => {
        try {
            const { source, destination, draggableId } = result;

            // Jeśli brak miejsca docelowego, zakończ
            if (!destination) return;

            // Jeśli pozycja się nie zmienia, zakończ
            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            ) {
                return;
            }

            // Pobierz kolumny źródłową i docelową
            const startColumnTasks = columns[source.droppableId];
            const finishColumnTasks = columns[destination.droppableId];

            if (!startColumnTasks || !finishColumnTasks) return;

            // Przenieś zadanie między kolumnami
            const updatedStartColumn = [...startColumnTasks];
            const [movedTask] = updatedStartColumn.splice(source.index, 1);
            console.log(movedTask);

            const updatedFinishColumn = [...finishColumnTasks];
            movedTask.status = destination.droppableId as Task["status"];
            updatedFinishColumn.splice(destination.index, 0, movedTask);

            // Zaktualizuj stan
            setColumns((prev) => ({
                ...prev,
                [source.droppableId]: updatedStartColumn,
                [destination.droppableId]: updatedFinishColumn,
            }));

            // Zaktualizuj status zadania na serwerze, w tym taskName i priority
            const formData = new FormData();
            formData.append("taskId", draggableId);
            formData.append("status", destination.droppableId);
            formData.append("taskName", movedTask.taskName);  // Dodajemy taskName
            formData.append("priority", movedTask.priority);  // Dodajemy priority
            await updateTask(formData);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(columns).map(([columnId, columnTasks]) => (
                    <Droppable droppableId={columnId} key={columnId} isDropDisabled={false} isCombineEnabled ignoreContainerClipping>
                        {(provided) => (
                            <div
                                className="bg-gray-100 p-4 rounded-lg shadow-md"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <h2 className="font-bold mb-4 text-gray-400 flex items-center gap-2"><b className={`text-3xl ${columnId === "BACKLOG"
                                    ? "text-red-800"
                                    : columnId === "TODO"
                                        ? "text-yellow text-blue-400"
                                        : columnId === "IN_PROGRESS" ? "text-amber-500" : "text-green-500"
                                    }`}>_</b>{columnId}</h2>

                                {columnTasks.map((task, index) => (
                                    <Draggable draggableId={task.id} index={index} key={task.id}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-3 mb-3 rounded-md shadow-sm"
                                            >
                                                <h3 className="font-semibold">{task.taskName}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {task.description || "No description"}
                                                </p>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${task.priority === "HIGH"
                                                        ? "bg-red-200 text-red-800"
                                                        : task.priority === "MEDIUM"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-green-200 text-green-800"
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext >
    );
};

export default KanbanBoard;
