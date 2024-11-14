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

export async function generateAvatar(username: string) {
    if (username.length < 2) {
        throw new Error("Username must be at least 2 characters long.");
    }

    const firstLetter = username.charAt(0).toUpperCase();
    const lastLetter = username.charAt(username.length - 1).toUpperCase();

    // Łączymy litery i zwracamy jako avatar
    return firstLetter + lastLetter;
}