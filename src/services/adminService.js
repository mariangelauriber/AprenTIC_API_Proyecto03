const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

exports.getAll = () => Admin.find();
exports.getById = (id) => Admin.findById(id);
exports.getByEmail = (email) => Admin.findOne({ email });

exports.create = async (data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  return Admin.create(data);
};

exports.update = async (id, adminData) => {
  if (adminData.password) adminData.password = await bcrypt.hash(adminData.password, 10);
  return Admin.findByIdAndUpdate(id, adminData, { new: true, runValidators: true });
};

exports.remove = (id) => Admin.findByIdAndDelete(id);
