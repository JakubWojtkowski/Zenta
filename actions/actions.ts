"use server";

import prisma from "@/lib/db"
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    try {
        await prisma.project.create({
            data: {
                title: formData.get("title") as string,
                slug: (formData.get("title") as string)
                    .replace(/\s+/g, "-")
                    .toLowerCase(),
                content: formData.get("content") as string,
                author: {
                    connect: {
                        email: "john@gmail.com"
                    },
                },
            },
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                console.log(
                    "There is a unique constraint violation, a new user cannot be created with this email"
                );
            }
        }
    }


    revalidatePath("/projects");
}

export async function updateProject(formData: FormData, id: string) {
    await prisma.project.update({
        where: { id },
        data: {
            title: formData.get("title") as string,
            slug: (formData.get("sltitleug") as string)
                .replace(/\s+/g, "-")
                .toLowerCase(),
            // content: formData.get("content") as string,
        }
    });

    revalidatePath("/projects");
}

export async function deleteProject(id: string) {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
}
