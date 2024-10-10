"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    await prisma.project.create({
        data: {
            title: formData.get("title") as string,
            slug: (formData.get("sltitleug") as string)
                .replace(/\s+/g, "-")
                .toLowerCase(),
            // content: formData.get("content") as string,
        }
    });

    revalidatePath("/");
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

    revalidatePath("/");
}

export async function deleteProject(id: string) {
    await prisma.project.delete({ where: { id } });
}
