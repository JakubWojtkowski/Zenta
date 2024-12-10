import { addMemberToProject } from './yourFilePath';
import { prisma } from './prismaMock';

jest.mock('./prismaMock', () => ({
  prisma: jest.requireActual('jest-mock-prisma').mockDeep(),
}));

describe('addMemberToProject', () => {
  const projectId = 'project-789';
  const userId = 'user-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a member to a project successfully', async () => {
    prisma.projectMember.create.mockResolvedValue({
      userId,
      projectId,
    });

    await addMemberToProject({
      get: (key: string) => (key === 'projectId' ? projectId : userId),
    } as FormData);

    expect(prisma.projectMember.create).toHaveBeenCalledWith({
      data: {
        project: { connect: { id: projectId } },
        user: { connect: { id: userId } },
      },
    });
  });

  it('should handle unique constraint violations gracefully', async () => {
    prisma.projectMember.create.mockRejectedValue({
      code: 'P2002',
    });

    await expect(
      addMemberToProject({
        get: (key: string) => (key === 'projectId' ? projectId : userId),
      } as FormData),
    ).resolves.not.toThrow();
  });
});
