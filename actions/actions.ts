"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function addProject(formData: FormData) {
    await prisma.project.create({
        data: {
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
        }
    });

    revalidatePath("/");
}