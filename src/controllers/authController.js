const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    if (await authService.buscarPorEmail(email)) {
      return res.status(409).json({ error: "Email ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await authService.crear({ email, password: hash, name, role });
    res
      .status(201)
      .json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.buscarPorEmail(email);

    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales mo válidas" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (e) {
    next(e);
  }
};
