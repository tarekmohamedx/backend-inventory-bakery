const Branch = require("../models/branchinventory.model").Branch;
const BranchInventory = require("../models/branchinventory.model").BranchInventory;

// class BranchRepository {
//   async createBranch(branchData) {
//     return await Branch.create(branchData);
//   }

//   async createBranchInventory(inventoryData) {
//     return await BranchInventory.create(inventoryData);
//   }

//   async findBranchById(branchId) {
//     return await Branch.findById(branchId);
//   }

//   async findBranchByName(name) {
//     return await Branch.findOne({ name });
//   }
// }

// module.exports = new BranchRepository();

module.exports.createBranch = async(branchData) =>{
    return await Branch.create(branchData);
}

module.exports.createBranchInventory = async(inventoryData) =>{
    return await BranchInventory.create(inventoryData);
}

module.exports.findBranchById = async(branchId) =>{
    return await Branch.findById(branchId);
}

module.exports.findBranchByName = async(name) =>{
    return await Branch.findOne({ name });
}