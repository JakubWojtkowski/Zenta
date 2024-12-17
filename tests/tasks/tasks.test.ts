import { createTask, deleteTask, updateTask, addTimeLog } from "@/actions/tasks";
import prisma from "@/lib/db";

// Mockowanie całej instancji Prisma
jest.mock("@/lib/db");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

jest.mock("next-auth", () => ({
    getServerSession: jest.fn(() => Promise.resolve({ user: { username: "testuser" } })),
}));

describe("Task Actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("createTask creates a new task", async () => {
        const formData = new FormData();
        formData.append("taskName", "Test Task");
        formData.append("priority", "HIGH");
        formData.append("status", "TODO");
        formData.append("projectId", "project123");

        // Mockujemy metodę create na Prisma
        (mockPrisma.task.create as jest.Mock).mockResolvedValue({ id: "task123" });

        await createTask(formData);

        expect(mockPrisma.task.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                taskName: "Test Task",
                priority: "HIGH",
                status: "TODO",
                projectId: "project123",
            }),
        });
    });

    test("deleteTask deletes a task", async () => {
        // Mockujemy metodę delete na Prisma
        (mockPrisma.task.delete as jest.Mock).mockResolvedValue({});

        await deleteTask("task123");

        expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: "task123" } });
    });

    test("updateTask updates a task", async () => {
        const formData = new FormData();
        formData.append("taskId", "task123");
        formData.append("taskName", "Updated Task");
        formData.append("priority", "LOW");

        // Mockujemy metodę update na Prisma
        (mockPrisma.task.update as jest.Mock).mockResolvedValue({});

        await updateTask(formData);

        expect(mockPrisma.task.update).toHaveBeenCalledWith({
            where: { id: "task123" },
            data: expect.objectContaining({
                taskName: "Updated Task",
                priority: "LOW",
            }),
        });
    });

    test("addTimeLog adds a time log", async () => {
        // Mockujemy metodę create na Prisma w tabeli timeLog
        (mockPrisma.timeLog.create as jest.Mock).mockResolvedValue({ id: "log123" });

        const result = await addTimeLog({ taskId: "task123", duration: 120 });

        expect(mockPrisma.timeLog.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                duration: 120,
                task: { connect: { id: "task123" } },
                user: { connect: { username: "testuser" } },
            }),
        });

        expect(result).toEqual({ id: "log123" });
    });
});
 