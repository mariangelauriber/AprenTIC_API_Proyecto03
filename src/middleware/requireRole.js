module.exports = (...rolesPermitidos) => (req, res, next) => {
  const userRole = req.user.role || req.user.rol;

  if (!rolesPermitidos.includes(userRole)) {
    return res.status(403).json({ error: 'No tienes permisos para esto' });
  }
  next();
};
