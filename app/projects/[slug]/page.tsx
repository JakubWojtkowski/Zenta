import prisma from "@/lib/db";

export default async function ProjectPage({ params }) {
    const project = await prisma.project.findUnique({
        where: {
            slug: params.slug,
        },
    })

    return (
        <div className="flex flex-col items-center gap-y-5 pt-24 text-center">
            <h1 className="text-3xl font-semibold">
                {project?.title}
            </h1>
            <p>{project?.content}</p>
        </div>
    );
}
