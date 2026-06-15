const adminService = require("../services/adminService");

exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAll();
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.getByEmail(req.params.email);

    if (!admin) {
      return res.status(404).json({
        error: "Admin no encontrado con ese email",
      });
    }

    res.json(admin);
  } catch (err) {
    next(err);
  }
};

exports.getAdminById = async (req, res, next) => {
  try {
    const admin = await adminService.getById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        error: "Admin no encontrado",
      });
    }

    res.json(admin);
  } catch (err) {
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.create(req.body);
    res.status(201).json(admin);
  } catch (err) {
    next(err);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const updatedAdmin = await adminService.update(req.params.id, req.body);

    if (!updatedAdmin) {
      return res.status(404).json({
        error: "Admin no encontrado",
      });
    }

    res.json(updatedAdmin);
  } catch (err) {
    next(err);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const deleted = await adminService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Admin no encontrado",
      });
    }

    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
