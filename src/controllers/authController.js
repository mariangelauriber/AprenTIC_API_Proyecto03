const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  try {
    const { email, password, nombre, apellidos, rol } = req.body;

    if (await authService.buscarPorEmail(email)) {
      return res.status(409).json({ error: "Email ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await authService.crear({
      email,
      password: hash,
      nombre,
      apellidos,
      role: rol,
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      rol: user.role,
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginAccount = await authService.buscarCuentaPorEmail(email);

    if (!loginAccount) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const { account, authCollection, profile, role } = loginAccount;
    const storedPassword = account.password || "";
    const passwordIsHashed = storedPassword.startsWith("$2");
    const ok = passwordIsHashed
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword;

    if (!ok) {
      return res.status(401).json({ error: "Credenciales no válidas" });
    }

    const profileId = profile?._id || account._id;

    const token = jwt.sign(
      {
        sub: profileId,
        accountId: account._id,
        email: account.email,
        role,
        authCollection,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: profileId,
        accountId: account._id,
        email: account.email,
        nombre: account.nombre,
        apellidos: account.apellidos,
        rol: role,
        authCollection,
      },
    });
  } catch (e) {
    next(e);
  }
};
