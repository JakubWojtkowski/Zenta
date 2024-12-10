import { createTask } from './yourFilePath';
import { prisma } from './prismaMock';

jest.mock('./prismaMock', () => ({
  prisma: jest.requireActual('jest-mock-prisma').mockDeep(),
}));

describe('createTask', () => {
  const formData = {
    get: jest.fn(),
  } as unknown as FormData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    formData.get = jest.fn((key) => {
      const data: Record<string, string | null> = {
        taskName: 'New Task',
        description: 'Task Description',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: 'project-123',
        assignedTo: 'user-456',
      };
      return data[key] || null;
    });

    prisma.task.create.mockResolvedValue({
      id: 'task-789',
      ...formData,
    });

    await createTask(formData);

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        taskName: 'New Task',
        description: 'Task Description',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: 'project-123',
        assignedTo: 'user-456',
      },
    });
  });
});
