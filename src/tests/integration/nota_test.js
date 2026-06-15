const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const Alumno = require("../../models/Alumno");
const Curso = require("../../models/Curso");
const Nota = require("../../models/Nota");
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

describe("PATCH /nota/:id/evaluacion", () => {
  it("actualiza parcialmente la calificacion de una nota como profesor", async () => {
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

    const alumno = await Alumno.create({
      nombre: "Luis",
      apellidos: "Garcia",
      email: "luis@aprentic.test",
      password: "Alumno123",
      curso: curso._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "API REST",
      curso: curso._id,
    });

    const nota = await Nota.create({
      alumno: alumno._id,
      proyecto: proyecto._id,
      profesor: profesor._id,
      calificacion: 5,
      estado: "apto",
      observaciones: "Inicial",
    });

    const token = jwt.sign(
      { sub: profesor._id, role: "profesor" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .patch(`/nota/${nota._id}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        calificacion: 8.5,
        estado: "no apto",
        observaciones: "Revisar entrega",
      });

    expect(res.status).toBe(200);
    expect(res.body.calificacion).toBe(8.5);
    expect(res.body.estado).toBe("no apto");
    expect(res.body.observaciones).toBe("Revisar entrega");

    const notaGuardada = await Nota.findById(nota._id);
    expect(notaGuardada.calificacion).toBe(8.5);
  });

  it("permite evaluar una nota sin profesor si el proyecto pertenece a su curso", async () => {
    const profesor = await Profesor.create({
      nombre: "Laura",
      apellidos: "Martin",
      email: "laura@aprentic.test",
      password: "Profesor123",
      especialidad: "Frontend",
      campus: "Madrid",
    });

    const curso = await Curso.create({
      nombre: "Frontend",
      campus: "Madrid",
      profesor: profesor._id,
    });

    const alumno = await Alumno.create({
      nombre: "Marta",
      apellidos: "Ruiz",
      email: "marta@aprentic.test",
      password: "Alumno123",
      curso: curso._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "Dashboard",
      curso: curso._id,
    });

    const nota = await Nota.create({
      alumno: alumno._id,
      proyecto: proyecto._id,
      calificacion: 4,
      estado: "no apto",
      observaciones: "Pendiente",
    });

    const token = jwt.sign(
      { sub: profesor._id, role: "profesor" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .patch(`/nota/${nota._id}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        calificacion: 7,
        estado: "apto",
        observaciones: "Corregido",
      });

    expect(res.status).toBe(200);
    expect(res.body.calificacion).toBe(7);
    expect(res.body.estado).toBe("apto");
  });
});

describe("PUT /nota/:id", () => {
  it("actualiza la nota completa como profesor", async () => {
    const profesor = await Profesor.create({
      nombre: "Carlos",
      apellidos: "Santos",
      email: "carlos@aprentic.test",
      password: "Profesor123",
      especialidad: "Datos",
      campus: "Valencia",
    });

    const curso = await Curso.create({
      nombre: "Data",
      campus: "Valencia",
      profesor: profesor._id,
    });

    const alumno = await Alumno.create({
      nombre: "Nora",
      apellidos: "Diaz",
      email: "nora@aprentic.test",
      password: "Alumno123",
      curso: curso._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "ETL",
      curso: curso._id,
    });

    const nota = await Nota.create({
      alumno: alumno._id,
      proyecto: proyecto._id,
      profesor: profesor._id,
      calificacion: 3,
      estado: "no apto",
      observaciones: "Antigua",
    });

    const token = jwt.sign(
      { sub: profesor._id, role: "profesor" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .put(`/nota/${nota._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        alumno: alumno._id,
        proyecto: proyecto._id,
        profesor: profesor._id,
        calificacion: 9,
        estado: "apto",
        observaciones: "Nueva",
      });

    expect(res.status).toBe(200);
    expect(res.body.calificacion).toBe(9);
    expect(res.body.estado).toBe("apto");
    expect(res.body.observaciones).toBe("Nueva");

    const notaGuardada = await Nota.findById(nota._id);
    expect(notaGuardada.calificacion).toBe(9);
    expect(notaGuardada.observaciones).toBe("Nueva");
  });
});

describe("DELETE /nota/:id", () => {
  it("elimina una nota como admin", async () => {
    const profesor = await Profesor.create({
      nombre: "Eva",
      apellidos: "Mora",
      email: "eva@aprentic.test",
      password: "Profesor123",
      especialidad: "QA",
      campus: "Malaga",
    });

    const curso = await Curso.create({
      nombre: "QA",
      campus: "Malaga",
      profesor: profesor._id,
    });

    const alumno = await Alumno.create({
      nombre: "Leo",
      apellidos: "Perez",
      email: "leo@aprentic.test",
      password: "Alumno123",
      curso: curso._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "Testing",
      curso: curso._id,
    });

    const nota = await Nota.create({
      alumno: alumno._id,
      proyecto: proyecto._id,
      profesor: profesor._id,
      calificacion: 6,
      estado: "apto",
      observaciones: "Ok",
    });

    const token = jwt.sign(
      { sub: new mongoose.Types.ObjectId(), role: "admin" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .delete(`/nota/${nota._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const notaEliminada = await Nota.findById(nota._id);
    expect(notaEliminada).toBeNull();
  });
});

describe("POST /nota/:id/delete", () => {
  it("elimina una nota usando la ruta alternativa", async () => {
    const profesor = await Profesor.create({
      nombre: "Iris",
      apellidos: "Leon",
      email: "iris@aprentic.test",
      password: "Profesor123",
      especialidad: "QA",
      campus: "Malaga",
    });

    const curso = await Curso.create({
      nombre: "QA avanzado",
      campus: "Malaga",
      profesor: profesor._id,
    });

    const alumno = await Alumno.create({
      nombre: "Pau",
      apellidos: "Navas",
      email: "pau@aprentic.test",
      password: "Alumno123",
      curso: curso._id,
    });

    const proyecto = await Proyecto.create({
      nombre: "Pruebas",
      curso: curso._id,
    });

    const nota = await Nota.create({
      alumno: alumno._id,
      proyecto: proyecto._id,
      profesor: profesor._id,
      calificacion: 6,
      estado: "apto",
    });

    const token = jwt.sign(
      { sub: new mongoose.Types.ObjectId(), role: "admin" },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .post(`/nota/${nota._id}/delete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const eliminada = await Nota.findById(nota._id);
    expect(eliminada).toBeNull();
  });
});
