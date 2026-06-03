const authService = require('../../src/services/auth.service');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');
jest.mock('../../src/config/env', () => ({ JWT_SECRET: 'test-secret', JWT_EXPIRES_IN: '1d' }));

describe('auth.service', () => {
  describe('register', () => {
    it('lanza error 409 si el email ya existe', async () => {
      User.findOne.mockResolvedValue({ email: 'test@test.com' });
      await expect(authService.register({ nombre: 'Test', email: 'test@test.com', password: '12345678' }))
        .rejects.toMatchObject({ status: 409 });
    });

    it('crea usuario correctamente', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '1', nombre: 'Test', email: 'test@test.com', rol: 'profesor' });
      const result = await authService.register({ nombre: 'Test', email: 'test@test.com', password: '12345678' });
      expect(result).toHaveProperty('email', 'test@test.com');
    });
  });

  describe('login', () => {
    it('lanza error 401 con credenciales inválidas', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.login({ email: 'x@x.com', password: 'wrong' }))
        .rejects.toMatchObject({ status: 401 });
    });
  });
});
