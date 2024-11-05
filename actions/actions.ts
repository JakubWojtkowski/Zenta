"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Funkcja do tworzenia projektu
export async function createProject(formData: FormData) {
    // Pobierz sesję użytkownika
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        throw new Error("You must be logged in to create a project.");
    }

    try {
        // Tworzenie projektu
        await prisma.project.create({
            data: {
                title: formData.get("title") as string,
                slug: (formData.get("title") as string)
                    .replace(/\s+/g, "-")
                    .toLowerCase(),
                content: formData.get("content") as string,
                author: {
                    connect: {
                        email: session.user.email, // Używamy emaila bieżącego użytkownika
                    },
                },
                // Dodanie autora jako członka projektu
                members: {
                    create: {
                        user: {
                            connect: {
                                email: session.user.email,
                            },
                        },
                    },
                },
            },
        });

        // Odswież ścieżkę /projects po utworzeniu projektu
        revalidatePath("/projects");
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                console.log("Unique constraint violation");
            }
        }
    }
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


export async function addMemberToProject(formData: FormData) {
    // Pobierz sesję użytkownika
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        throw new Error("You must be logged in to add members to a project.");
    }

    const projectId = formData.get("projectId") as string;
    const userId = formData.get("userId") as string;

    try {
        await prisma.projectMember.create({
            data: {
                project: {
                    connect: { id: projectId },
                },
                user: {
                    connect: { id: userId },
                },
            },
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                console.log("Member is already in the project");
            }
        } else {
            console.error(err);
        }
    }
}