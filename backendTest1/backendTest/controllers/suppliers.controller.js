const  suppliersService  = require('../services/suppliers.service');



module.exports = (() => {
    const router = require("express").Router();
  
        // get suppliers
        router.get("/suppliers", async (req, res, next) => {
          try{
            const suppliers = await suppliersService.getSupplier();
            res.status(200).json(suppliers);
          }catch(error){
            res.status(500).json({ error: error.message });
          }
        });
      
      
        // get supplier detail
        router.get("/suppliers/:id", async (req, res) => {
          try {
            const supplier = await suppliersService.getSupplierById(req.params.id);
            if (!supplier) {
              return res.status(404).json({ error: "supplier not found" });
            }
            res.status(200).json(supplier);
          } catch (error) {
            console.error("Error fetching supplier details:", error);
            res.status(500).json({ error: error.message });
          }
        });
        
      
        // create supplier
        router.post("/suppliers", async(req, res, next) => {
          try{
            const new_supplier = await suppliersService.createSupplier(req.body);
            res.status(201).json(new_supplier);
          }catch(error){
            res.status(500).json({ error: error.message });
          }
        });
      
      
        // update supplier
        router.put("/suppliers/:id", async(req, res, next) => {
          try {
            const updatedSupplier = await suppliersService.updateSupplier(req.params.id, req.body);
            if (!updatedSupplier) {
              return res.status(404).json({ error: "This supplier does not exist :(" });
            }
            res.status(200).json(updatedSupplier);
          } catch (error) {
            console.error("Error updating supplier:", error);
            res.status(500).json({ error: error.message });
          }
        });

      
        // delete supplier
        router.delete("/suppliers/:id", async (req, res) => {
          try {
            const deletedSupplier = await suppliersService.deleteSupplier(req.params.id);
            if (!deletedSupplier) {
              return res.status(404).json({ error: "This supplier does not exist :(" });
            }
            res.status(200).json({ message: "supplier deleted successfully" });
          } catch (error) {
            console.error("Error deleting supplier: ", error);
            res.status(500).json({ error: error.message });
          }
        });

                // // Soft remove account ( delete user account )
        // router.delete("/suppliers/:id/soft-delete", async (req, res) => {
        //   try {
        //     const softDeleteUser = await suppliersService.softDelete(req.params.id);
        //     if (!softDeleteUser) {
        //       return res.status(404).json({ error: "This supplier does not exist :(" });
        //     }
        //     res.status(200).json({ message: "supplier account deactivated successfully" });
        //   } catch (error) {
        //     console.error("Error soft deleting supplier:", error);
        //     res.status(500).json({ error: error.message });
        //   }
        // });
  
    return router;
})();
  