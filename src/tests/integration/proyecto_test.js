const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const Curso = require("../../models/Curso");
const Profesor = require("../../models/Profesor");
const Proyecto = require("../../models/Proyecto");

process.env.JWT_SECRET = "secreto_de_test";
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

describe("POST /proyecto", () => {
  it("permite crear un proyecto al profesor de ese curso", async () => {
    const profesor = await Profesor.create({
      nombre: "Ana",
      apellidos: "Lopez",
      email: "ana@aprentic.test",
      password: "Profesor123",
      especialidad: "Backend",
      campus: "Sevilla",
    });

    const curso = await Curso.create({
      nombre: "Full Stack",
      campus: "Sevilla",
      profesor: profesor._id,
    });

    const token = jwt.sign(
      { sub: profesor._id, role: "profesor" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .post("/proyecto")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Proyecto final",
        curso: curso._id,
      });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("Proyecto final");
    expect(String(res.body.curso._id)).toBe(String(curso._id));

    const proyectoGuardado = await Proyecto.findOne({
      nombre: "Proyecto final",
    });
    expect(proyectoGuardado).not.toBeNull();
  });
});

describe("POST /proyecto/:id/delete", () => {
  it("elimina un proyecto usando la ruta alternativa", async () => {
    const profesor = await Profesor.create({
      nombre: "Mario",
      apellidos: "Vega",
      email: "mario@aprentic.test",
      password: "Profesor123",
      especialidad: "Backend",
      campus: "Sevilla",
    });

    const curso = await Curso.create({
      nombre: "APIs",
      campus: "Sevilla",
      profesor: profesor._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "Delete fallback",
      curso: curso._id,
    });

    const token = jwt.sign(
      { sub: profesor._id, role: "admin" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .post(`/proyecto/${proyecto._id}/delete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const eliminado = await Proyecto.findById(proyecto._id);
    expect(eliminado).toBeNull();
  });
});
