"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function generateAvatar(username: string): Promise<string> {
    if (!username || username.trim().length < 2) {
        throw new Error("Username must be at least 2 characters long.");
    }

    // Usuwamy białe znaki z początku i końca
    const trimmedUsername = username.trim();

    const firstLetter = trimmedUsername.charAt(0).toUpperCase();
    const lastLetter = trimmedUsername.charAt(trimmedUsername.length - 1).toUpperCase();

    // Generujemy "awatar"
    return `${firstLetter}${lastLetter}`;
}
