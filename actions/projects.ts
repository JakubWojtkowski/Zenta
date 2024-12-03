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

export async function deleteProject(projectId: string) {
    try {
        // Usuwanie projektu z bazy danych
        await prisma.project.delete({
            where: { id: projectId },
        });

        // Odśwież ścieżkę `/projects` po usunięciu projektu
        revalidatePath("/");
    } catch (err) {
        console.error("Failed to delete project:", err);
        throw new Error("Failed to delete project.");
    }
}

export async function updateProject(projectId: string, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

        // Aktualizacja projektu w bazie danych
        await prisma.project.update({
            where: { id: projectId },
            data: {
                title,
                slug: title.replace(/\s+/g, "-").toLowerCase(),
                content,
            },
        });

        // Odśwież ścieżkę `/projects`
        revalidatePath("/");
    } catch (err) {
        console.error("Failed to update project:", err);
        throw new Error("Failed to update project.");
    }
}
