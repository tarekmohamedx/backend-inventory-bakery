const BranchRepository = require("../repos/branch.repo");

module.exports.addBranch = async (branchData) => {
    const existingBranch = await BranchRepository.findBranchByName(branchData.name);
    if (existingBranch) {
      throw new Error("Branch with this name already exists.");
    }
    return await BranchRepository.createBranch(branchData);
};

module.exports.addBranchInventory = async (inventoryData) =>{
    const branch = await BranchRepository.findBranchById(inventoryData.branchId);
    if (!branch) {
      throw new Error("Branch not found.");
    }
    return await BranchRepository.createBranchInventory(inventoryData);
}


// class BranchService {
//   async addBranch(branchData) {
//     const existingBranch = await BranchRepository.findBranchByName(branchData.name);
//     if (existingBranch) {
//       throw new Error("Branch with this name already exists.");
//     }
//     return await BranchRepository.createBranch(branchData);
//   }

//   async addBranchInventory(inventoryData) {
//     // Check if branch exists
//     const branch = await BranchRepository.findBranchById(inventoryData.branchId);
//     if (!branch) {
//       throw new Error("Branch not found.");
//     }

//     // Create inventory entry for the branch
//     return await BranchRepository.createBranchInventory(inventoryData);
//   }
// }

// module.exports = new BranchService();
