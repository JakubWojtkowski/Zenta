import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const initialProjects: Prisma.ProjectCreateInput[] = [
    {
        title: "Project 1",
        slug: "project-1",
        content: "content ok kok okok oko",
        author: {
            connectOrCreate: {
                where: {
                    email: "john@gmail.com"
                },
                create: {
                    username: "John",
                    email: "john@gmail.com",
                    password: "password",
                    role: "git"
                },
            },
        },
    },
];

async function main() {
    console.log(`Start seeding ...`);

    for (const project of initialProjects) {
        const createdProject = await prisma.project.create({
            data: project,
        });
        console.log(`Created project with id: ${createdProject.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })