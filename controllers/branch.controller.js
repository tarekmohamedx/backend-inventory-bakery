const BranchService = require("../services/branch.service");
const express = require("express");

module.exports = (() => {
    const router = require("express").Router();
    router.post("/addBranche", async (req, res, next) => {
        try {
            const branch = await BranchService.addBranch(req.body);
            res.status(201).json({ success: true, message: "Branch created successfully", data: branch });
          } catch (error) {
            res.status(400).json({ success: false, message: error.message });
          }
    });

    router.post("/addInventoryBranche", async (req, res, next) => {
        try {
            const inventory = await BranchService.addBranchInventory(req.body);
            res.status(201).json({ success: true, message: "Branch inventory added successfully", data: inventory });
          } catch (error) {
            res.status(400).json({ success: false, message: error.message });
          }
    });
    
    return router;
})();

// class BranchController {
//   async createBranch(req, res) {
//     try {
//       const branch = await BranchService.addBranch(req.body);
//       res.status(201).json({ success: true, message: "Branch created successfully", data: branch });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   async createBranchInventory(req, res) {
//     try {
//       const inventory = await BranchService.addBranchInventory(req.body);
//       res.status(201).json({ success: true, message: "Branch inventory added successfully", data: inventory });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }
// }

// module.exports = new BranchController();
