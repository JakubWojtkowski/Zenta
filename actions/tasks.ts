"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// Definicja typu aktualizacji taska
interface UpdateTaskInput {
    taskId: string;
    taskName?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status?: "TODO" | "IN_PROGRESS" | "DONE";
}

// Funkcja do tworzenia zadania
export async function createTask(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("You must be logged in to create a task.");
    }

    const status = formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE" || "TODO"; // Ustawienie domyślnego statusu na TODO

    const taskData = {
        taskName: formData.get("taskName") as string,
        description: formData.get("description") as string | null,
        status: status,
        priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        projectId: formData.get("projectId") as string,
        assignedTo: formData.get("assignedTo") as string | null,
        estimatedPoints: formData.get("estimatedPoints") ? parseInt(formData.get("estimatedPoints") as string) : null,
        timeEstimate: formData.get("timeEstimate") ? parseInt(formData.get("timeEstimate") as string) : null,
    };

    console.log("Dane zadania:", taskData); // Logowanie danych przed zapisaniem

    try {
        await prisma.task.create({
            data: {
                taskName: taskData.taskName,
                description: taskData.description,
                status: taskData.status, // Status z formularza lub domyślny
                priority: taskData.priority,
                projectId: taskData.projectId,
                assignedTo: taskData.assignedTo,
                estimatedPoints: taskData.estimatedPoints,
                timeEstimate: taskData.timeEstimate,
            },
        });

        revalidatePath(`/projects/${taskData.projectId}`); // Odśwież stronę projektu
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.log("Error creating task:", err.message);
        } else {
            console.error("Błąd podczas tworzenia zadania:", err); // Obsługuje inne błędy
        }
    }
}

export const deleteTask = async (taskId: string) => {
    await prisma.task.delete({
        where: { id: taskId },
    });
};

export async function updateTask(formData: FormData) {
    // Pobierz wartości z formData i przypisz typy
    const taskId = formData.get("taskId") as string;
    const taskName = formData.get("taskName") as string | undefined;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    const status = formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE" | undefined;

    // Budowanie obiektu aktualizacji
    const updateData: UpdateTaskInput = {
        taskId,
        taskName,
        priority,
        status,
    };

    try {
        // Wykonanie aktualizacji w Prisma
        await prisma.task.update({
            where: { id: taskId },
            data: {
                taskName: updateData.taskName,
                priority: updateData.priority,
                status: updateData.status,
            },
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.log("Prisma error:", err.message);
        } else {
            console.error("Unknown error during task update:", err);
        }
    }
}

// Interfejs dla danych wejściowych do akcji
interface AddTimeLogParams {
    taskId: string;
    duration: number;
    userId: string;
}

// Akcja do dodawania logu czasu
export async function addTimeLog({ taskId, duration }: AddTimeLogParams) {
    console.log("okk");
    // Pobieranie sesji użytkownika
    const session = await getServerSession(authOptions);

    // Sprawdzanie, czy użytkownik jest zalogowany
    if (!session || !session.user) {
        throw new Error("Musisz być zalogowany, aby dodać log czasu.");
    }

    // Pobieranie ID użytkownika z sesji
    const userId = session.user.id;

    // Dodanie logu czasu do bazy danych
    
    try {
        const timeLog = await prisma.timeLog.create({
            data: {
                duration,
                task: { connect: { id: taskId } },
                user: { connect: { id: userId } },
            },
        });
        console.log(taskId, userId, timeLog);

        // Zwrot nowo utworzonego logu czasu
        return timeLog;
    } catch (error) {
        console.error("Błąd przy dodawaniu logu czasu:", error);
        throw new Error("Nie udało się dodać logu czasu.");
    }
}
