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
