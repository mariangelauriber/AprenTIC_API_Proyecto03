const Admin = require('../models/Admin');

exports.getAll = () => Admin.find();
exports.getById = (id) => Admin.findById(id);
exports.getByEmail = (email) => Admin.findOne({ email });
exports.create = (data) => Admin.create(data);
exports.update = (id, adminData) => Admin.findByIdAndUpdate(id, adminData);
exports.remove = (id) => Admin.findByIdAndDelete(id);