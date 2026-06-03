const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  await request(app).post('/api/auth/register').send({
    nombre: 'Admin', email: 'adm@test.com', password: 'Password1!', rol: 'admin',
  });
  const res = await request(app).post('/api/auth/login').send({ email: 'adm@test.com', password: 'Password1!' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/alumnos', () => {
  it('requiere autenticación', async () => {
    const res = await request(app).get('/api/alumnos');
    expect(res.statusCode).toBe(401);
  });

  it('devuelve lista con token válido', async () => {
    const res = await request(app).get('/api/alumnos').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
