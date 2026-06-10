const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "profesor", "user"],
      default: "user",
    },
    especialidad: { type: String },
    campus: { type: String },
    cursos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Curso" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema, "user");
