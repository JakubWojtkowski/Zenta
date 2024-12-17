import { createProject, deleteProject, updateProject } from "@/actions/projects";
import prisma from "@/lib/db";

// Mockowanie Prisma i sesji użytkownika
jest.mock("@/lib/db");
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(() => Promise.resolve({ user: { email: "testuser@example.com" } })),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Project Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createProject creates a new project", async () => {
    const formData = new FormData();
    formData.append("title", "Test Project");
    formData.append("content", "Test Project Content");

    // Mockujemy metodę create na Prisma
    (mockPrisma.project.create as jest.Mock).mockResolvedValue({ id: "project123", title: "Test Project" });

    await createProject(formData);

    expect(mockPrisma.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Test Project",
        slug: "test-project",
        content: "Test Project Content",
        author: { connect: { email: "testuser@example.com" } },
        members: { create: { user: { connect: { email: "testuser@example.com" } } } },
      }),
    });
  });

  test("deleteProject deletes an existing project", async () => {
    // Mockujemy metodę findUnique i delete na Prisma
    (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue({ id: "project123" });
    (mockPrisma.project.delete as jest.Mock).mockResolvedValue({});

    await deleteProject("project123");

    expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: "project123" } });
    expect(mockPrisma.project.delete).toHaveBeenCalledWith({ where: { id: "project123" } });
  });

  test("deleteProject throws an error if project does not exist", async () => {
    // Mockujemy metodę findUnique, aby zwróciła null (projekt nie istnieje)
    (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(deleteProject("nonexistentProject")).rejects.toThrow("Project not found");
  });

  test("updateProject updates an existing project", async () => {
    const formData = new FormData();
    formData.append("title", "Updated Project");
    formData.append("content", "Updated Content");

    // Mockujemy metodę update na Prisma
    (mockPrisma.project.update as jest.Mock).mockResolvedValue({ id: "project123", title: "Updated Project" });

    await updateProject("project123", formData);

    expect(mockPrisma.project.update).toHaveBeenCalledWith({
      where: { id: "project123" },
      data: expect.objectContaining({
        title: "Updated Project",
        slug: "updated-project",
        content: "Updated Content",
      }),
    });
  });

  test("updateProject throws an error if update fails", async () => {
    const formData = new FormData();
    formData.append("title", "Updated Project");
    formData.append("content", "Updated Content");

    // Mockujemy metodę update, aby wyrzuciła błąd
    (mockPrisma.project.update as jest.Mock).mockRejectedValue(new Error("Failed to update project"));

    await expect(updateProject("project123", formData)).rejects.toThrow("Failed to update project");
  });
});
