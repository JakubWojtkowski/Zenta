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
                sprintId: null, // Zadania bez przypisanego sprintu
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
    sprintId: string; // ID sprintu do zakończenia
    projectId: string; // ID projektu dla odświeżenia
}

export async function endSprint(data: EndSprintInput) {
    try {
        // Aktualizacja statusu sprintu w bazie danych (np. oznaczenie jako zakończony)
        await prisma.sprint.update({
            where: { id: data.sprintId },
            data: { isCompleted: true }, // Zakładamy, że masz pole `isCompleted` w tabeli `sprint`
        });

        // Opcjonalnie: aktualizacja zadań w tym sprincie (np. usunięcie przypisania sprintu)
        await prisma.task.updateMany({
            where: { sprintId: data.sprintId },
            data: { sprintId: null }, // Oznacza zadania jako niezwiązane z żadnym sprintem
        });

        // Odświeżenie ścieżki projektu po zakończeniu sprintu
        revalidatePath(`/projects/${data.projectId}`);

        return { success: true, message: "Sprint zakończony pomyślnie." };
    } catch (err) {
        console.error("Error ending sprint:", err);
        throw new Error("Failed to end sprint.");
    }
}
