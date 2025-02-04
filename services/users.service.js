const userRepo = require('../repos/users.repo');

module.exports.getUsers = async () => {
    return await userRepo.getUsers();
};

module.exports.getUserById = async (userId) => {
    return await userRepo.getUserById(userId);
};
module.exports.getUserByemail = async (email) => {
    return await userRepo.getUserByemail(email);
};

module.exports.createUser = async (userData) => {
    return await userRepo.createUser(userData);
};

module.exports.updateUser = async(userId, updatedData) => {
    return await userRepo.updateUser(userId, updatedData);
};

module.exports.softDelete = async (userId) => {
    return await userRepo.softDelete(userId, { status: "inactive" });
};
  
module.exports.deleteUser = async (userId) => {
    return await userRepo.deleteUser(userId);
};