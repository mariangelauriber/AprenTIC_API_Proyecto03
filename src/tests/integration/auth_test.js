const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

process.env.JWT_SECRET = 'secreto_de_test';
let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
    const colecciones = await mongoose.connection.db.collections();
    for (const c of colecciones) await c.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});


describe('POST /auth/register', () => {
    it('crea un usuario y devuelve 201 (sin la contraseña)',
        async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ email: 'a@a.com', password: 'secreta', nombre: 'Ana' });
            expect(res.status).toBe(201);
            expect(res.body.email).toBe('a@a.com');
            expect(res.body.password).toBeUndefined();
        });
    it('devuelve 400 con datos inválidos', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ email: 'noesemail' });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/login', () => {
    it('devuelve un token con credenciales correctas', async () => {
        await request(app)
          .post('/auth/register')
          .send({ email: 'a@a.com', password: 'secreta', nombre: 'Ana', rol: 'admin' });
        const res = await request(app)
          .post('/auth/login')
          .send({ email: 'a@a.com', password: 'secreta' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
}); 
