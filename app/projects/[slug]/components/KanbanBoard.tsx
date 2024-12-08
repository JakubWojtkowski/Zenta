"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { updateTask } from "@/actions/tasks";
import { Task } from "@/types/types";

interface KanbanBoardProps {
    tasks: Task[];
}

const truncateText = (text: string, maxLength: number): string =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    const [columns, setColumns] = React.useState<{
        // BACKLOG: Task[];
        TODO: Task[];
        IN_PROGRESS: Task[];
        DONE: Task[];
    }>(() => ({
        // BACKLOG: tasks.filter((task) => task.status === "BACKLOG"),
        TODO: tasks.filter((task) => task.status === "TODO"),
        IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
        DONE: tasks.filter((task) => task.status === "DONE"),
    }));

    const getUpdatedColumns = (sourceId: string, destinationId: string, task: Task, sourceIndex: number, destIndex: number) => {
        const sourceTasks = Array.from(columns[sourceId as keyof typeof columns]);
        const destinationTasks = Array.from(columns[destinationId as keyof typeof columns]);

        // Remove from source and update
        sourceTasks.splice(sourceIndex, 1);
        destinationTasks.splice(destIndex, 0, task);

        return {
            ...columns,
            [sourceId]: sourceTasks,
            [destinationId]: destinationTasks,
        };
    };

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Jeśli brak zmiany pozycji lub nie ma miejsca docelowego
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        // Znajdź przeciągnięte zadanie
        const draggedTask = columns[source.droppableId as keyof typeof columns][source.index];
        if (!draggedTask) return;

        // Zmień status zadania
        const updatedColumns = getUpdatedColumns(
            source.droppableId,
            destination.droppableId,
            { ...draggedTask, status: destination.droppableId as Task["status"] },
            source.index,
            destination.index
        );

        // Zaktualizuj lokalny stan
        setColumns(updatedColumns);

        // Zaktualizuj serwer
        try {
            const formData = new FormData();
            formData.append("taskId", draggableId);
            formData.append("status", destination.droppableId);
            formData.append("taskName", draggedTask.taskName);
            formData.append("priority", draggedTask.priority);
            formData.append("estimatedPoints", draggedTask.estimatedPoints.toString());
            await updateTask(formData);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(columns).map(([columnId, columnTasks]) => (
                    <Droppable droppableId={columnId} key={columnId}>
                        {(provided) => (
                            <div
                                className="bg-gray-100 p-4 rounded-lg shadow-md"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <h2 className="font-bold mb-4 text-gray-400 flex items-center gap-2">
                                    {columnId}
                                </h2>


                                {columnTasks.map((task, index) => (
                                    <Draggable draggableId={task.id.toString()} index={index} key={task.id.toString()}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-3 mb-3 rounded-md shadow-sm overflow-hidden"
                                            >
                                                <a href={`/tasks/${task.id}`} className="font-semibold text-gray-800 truncate">
                                                    {truncateText(task.taskName, 10)}
                                                </a>
                                                <p className="text-sm text-gray-500 truncate mt-2 mb-4">
                                                    {truncateText(task.description || "No description", 20).concat("...")}
                                                </p>
                                                <div className="flex justify-between">
                                                    <span
                                                        className={`text-xs font-bold px-6 py-1 rounded-full ${task.priority === "HIGH"
                                                            ? "bg-red-200 text-red-800"
                                                            : task.priority === "MEDIUM"
                                                                ? "bg-yellow-200 text-yellow-800"
                                                                : "bg-green-200 text-green-800"
                                                            }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    <span
                                                        className="rounded-full font-bold  bg-gray-300 px-2"
                                                    >
                                                        {task.estimatedPoints}
                                                    </span>
                                                </div>
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
        </DragDropContext>
    );
};

export default KanbanBoard;
