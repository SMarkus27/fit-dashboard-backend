import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  const safeUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let usersService: jest.Mocked<
    Pick<UsersService, 'findByEmail' | 'validatePassword'>
  >;
  let authService: AuthService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    usersService = {
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };
    authService = new AuthService(usersService as jest.Mocked<UsersService>);
  });

  it('should login and return an access token without password hash', async () => {
    usersService.findByEmail.mockResolvedValue({
      ...safeUser,
      passwordHash: 'hash',
    });
    usersService.validatePassword.mockResolvedValue(true);

    const result = await authService.login('test@example.com', 'password123');

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.user).toEqual(safeUser);
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('should reject invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login('test@example.com', 'password123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should verify a generated token', async () => {
    usersService.findByEmail.mockResolvedValue({
      ...safeUser,
      passwordHash: 'hash',
    });
    usersService.validatePassword.mockResolvedValue(true);

    const { accessToken } = await authService.login(
      'test@example.com',
      'password123',
    );
    const payload = authService.verifyToken(accessToken);

    expect(payload.sub).toBe(safeUser.id);
    expect(payload.email).toBe(safeUser.email);
  });
});
