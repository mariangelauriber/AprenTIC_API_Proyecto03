const adminService = require("../services/adminService");

exports.getAdmin = async (req, res, next) => {
try {
        if (req.params.email) {
            const admin = await adminService.getAdminByEmail(req.params.email);
            if (!admin) return res.status(404).json({ error: 'Admin no encontrado con ese email' });
            return res.json(admin);
        }
        const admin = await adminService.getAll();
        res.json(admin);
    } catch (err) {
        next(err);
    }
};
 
exports.createAdmin = async (req,res,next) => {
  const admin = await adminService.create(req.body);
  res.status(201).json(admin);
  next();
};

exports.updateAdmin = async (req, res, next) => {
    try {
        const updatedAdmin = await adminService.actualizarAdmin(req.params.id, req.body);
        if (!updatedAdmin) return res.status(404).json({ error: 'Admin no encontrado' });
        res.json(updatedAdmin);
    } catch (err) {
        next(err);
    }
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        const deleteAdmin = await adminService.deleteAdmin(req.params.id); 
         if (!deleteAdmin) return res.status(404).json({ error: 'Admin no encontrado' });
        res.json(deleteAdmin);
    } catch (err) {
        next(err);
    }
};

