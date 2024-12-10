"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateSprintInput {
    name: string;
    startDate: Date;
    endDate: Date;
    projectId: string;
    taskIds: string[]; // ID zadań do przypisania do sprintu
}

export async function createSprint(data: CreateSprintInput) {
    console.log(data);

    try {
        // Sprawdzenie, czy istnieją zadania w backlogu
        const tasksInBacklog = await prisma.task.count({
            where: {
                projectId: data.projectId,
                sprintId: null,
            },
        });

        if (tasksInBacklog === 0) {
            throw new Error("Nie można utworzyć sprintu, ponieważ backlog jest pusty.");
        }

        // Tworzenie nowego sprintu
        const sprint = await prisma.sprint.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                projectId: data.projectId,
            },
        });

        // Przypisywanie zadań do sprintu
        if (data.taskIds.length > 0) {
            await prisma.task.updateMany({
                where: { id: { in: data.taskIds } },
                data: { sprintId: sprint.id },
            });
        }

        // Odświeżenie strony projektu
        revalidatePath(`/projects/${data.projectId}`);

        return sprint;
    } catch (err) {
        console.error("Error creating sprint:", err);
        throw new Error("Failed to create sprint.");
    }
}

interface EndSprintInput {
    sprintId: string; 
    projectId: string;
}

export async function endSprint(data: EndSprintInput) {
    try {
        // Aktualizacja statusu sprintu w bazie danych
        await prisma.sprint.update({
            where: { id: data.sprintId },
            data: { isCompleted: true }, 
        });

        await prisma.task.updateMany({
            where: { sprintId: data.sprintId },
            data: { sprintId: null },
        });

        revalidatePath(`/projects/${data.projectId}`);

        return { success: true, message: "Sprint zakończony pomyślnie." };
    } catch (err) {
        console.error("Error ending sprint:", err);
        throw new Error("Failed to end sprint.");
    }
}
