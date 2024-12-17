import {
    assignUserToTask,
    addUserToTask,
    addMemberToProject,
    generateAvatar,
    getAvailableUsers,
    getAssignableUsersForTask,
} from "@/actions/users";
import prisma from "@/lib/db";

// Mockowanie całej instancji Prisma
jest.mock("@/lib/db");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

jest.mock("next-auth", () => ({
    getServerSession: jest.fn(() => Promise.resolve({ user: { email: "test@example.com" } })),
}));

describe("User Actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("assignUserToTask assigns a user to a task", async () => {
        // Mockowanie metod Prisma
        (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue({ id: "task123", projectId: "project123" });
        (mockPrisma.projectMember.findFirst as jest.Mock).mockResolvedValue({ userId: "user123" });
        (mockPrisma.task.update as jest.Mock).mockResolvedValue({ id: "task123", assignedTo: "user123" });

        await assignUserToTask("task123", "user123");

        expect(mockPrisma.task.update).toHaveBeenCalledWith({
            where: { id: "task123" },
            data: { assignedTo: "user123" },
        });
    });

    test("addUserToTask assigns a user to a task for a valid user", async () => {
        const formData = new FormData();
        formData.append("taskId", "task123");
        formData.append("userId", "user123");
        const projectId = "project123";

        // Mockowanie metod Prisma
        (mockPrisma.projectMember.findFirst as jest.Mock).mockResolvedValue({ userId: "user123" });
        (mockPrisma.task.update as jest.Mock).mockResolvedValue({ id: "task123", assignee: { connect: { id: "user123" } } });

        await addUserToTask(formData, projectId);

        expect(mockPrisma.task.update).toHaveBeenCalledWith({
            where: { id: "task123" },
            data: {
                assignee: { connect: { id: "user123" } },
            },
        });
    });

    test("addMemberToProject adds a user to the project", async () => {
        const formData = new FormData();
        formData.append("projectId", "project123");
        formData.append("userId", "user123");

        // Mockowanie metod Prisma
        (mockPrisma.projectMember.create as jest.Mock).mockResolvedValue({});

        await addMemberToProject(formData);

        expect(mockPrisma.projectMember.create).toHaveBeenCalledWith({
            data: {
                project: { connect: { id: "project123" } },
                user: { connect: { id: "user123" } },
            },
        });
    });

    test("generateAvatar generates an avatar", async () => {
        const avatar = await generateAvatar("testuser");

        expect(avatar).toBe("TT");
    });

    test("getAvailableUsers returns users not in the project", async () => {
        const projectId = "project123";

        // Mockowanie metod Prisma
        (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue({
            id: "project123",
            members: [{ userId: "user123" }],
        });
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([
            { id: "user124", username: "user124" },
            { id: "user125", username: "user125" },
        ]);

        const availableUsers = await getAvailableUsers(projectId);

        expect(availableUsers).toEqual([
            { id: "user124", username: "user124" },
            { id: "user125", username: "user125" },
        ]);
    });

    test("getAssignableUsersForTask returns assignable users for a task", async () => {
        const taskId = "task123";

        // Mockowanie metod Prisma
        (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue({
            id: "task123",
            projectId: "project123",
        });
        (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue({
            id: "project123",
            members: [
                { userId: "user123", user: { id: "user123", username: "user123" } },
                { userId: "user124", user: { id: "user124", username: "user124" } },
            ],
        });

        const assignableUsers = await getAssignableUsersForTask(taskId);

        expect(assignableUsers).toEqual([
            { id: "user123", username: "user123" },
            { id: "user124", username: "user124" },
        ]);
    });
});
