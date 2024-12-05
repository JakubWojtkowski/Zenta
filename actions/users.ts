"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addUserToTask(formData: FormData, projectId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        throw new Error("You must be logged in to assign users to tasks.");
    }

    const taskId = formData.get("taskId") as string;
    const userId = formData.get("userId") as string;

    console.log("Received taskId:", taskId); // Sprawdzamy, czy taskId jest poprawnie odczytane

    if (!taskId || !userId) {
        throw new Error("Task ID or User ID is missing.");
    }

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                assignee: {
                    connect: { id: userId },
                },
            },
        });

        // Odświeżenie ścieżki projektu
        revalidatePath(`/projects/${projectId}`);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(err);
            throw new Error("Failed to assign user to task.");
        } else {
            console.error(err);
            throw err;
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

export async function getAvailableUsers(projectId: string): Promise<User[]> {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true },
    });

    if (!project) {
        throw new Error("Project not found.");
    }

    const memberIds = project.members.map((member) => member.userId);

    const availableUsers = await prisma.user.findMany({
        where: { id: { in: memberIds } }, // Pobieramy użytkowników będących członkami projektu
    });

    return availableUsers;
}
