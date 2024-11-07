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