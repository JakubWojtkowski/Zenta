import { generateAvatar } from './yourFilePath';

describe('generateAvatar', () => {
  it('should generate an avatar based on username', async () => {
    const username = 'JohnDoe';
    const result = await generateAvatar(username);
    expect(result).toBe('JE');
  });

  it('should throw an error for a username shorter than 2 characters', async () => {
    await expect(generateAvatar('J')).rejects.toThrow('Username must be at least 2 characters long.');
  });

  it('should trim spaces from the username', async () => {
    const username = '  Jane ';
    const result = await generateAvatar(username);
    expect(result).toBe('JE');
  });
});
