const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario nuevo y devuelve 201', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Admin Test',
      email: 'admin@test.com',
      password: 'Password1!',
      rol: 'admin',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'admin@test.com');
  });

  it('devuelve 409 si el email ya existe', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Admin Test',
      email: 'admin@test.com',
      password: 'Password1!',
    });
    expect(res.statusCode).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('devuelve token con credenciales correctas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'Password1!',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('devuelve 401 con credenciales incorrectas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'wrong',
    });
    expect(res.statusCode).toBe(401);
  });
});
