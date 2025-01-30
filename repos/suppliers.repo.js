const Supplier = require('../models/suppliers.model');


// get all suppliers
module.exports.getSupplier = async() => {
    try{
        const suppliers = await Supplier.find({});
        return suppliers;
    }catch (error) {
        console.error("get All suppliers error: ", error);
        throw error;
    }
} 

// get supplier detail
module.exports.getSupplierById = async (supplierId) => {
    try {
      return await Supplier.findById(supplierId);
    } catch (error) {
      console.error("Error fetching supplier by ID:", error);
      throw error;
    }
};
  
  // create supplier
module.exports.createSupplier = async (supplierData) => {
    try {
        const newSupplier = new Supplier(supplierData);
        const savedSupplier = await newSupplier.save();
        return savedSupplier;
    } catch (error) {
        console.error("Error creating supplier: ", error);
        throw error;
    }
};
  
  // update supplier
module.exports.updateSupplier = async (supplierId, updatedData) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, updatedData, {
        new: true,
        runValidators: true,
        });
        return updatedSupplier;
    } catch (error) {
        console.error("Error updating supplier: ", error);
        throw error;
    }
};


  // delete a supplier
  module.exports.deleteSupplier = async (supplierId) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);
        return deletedSupplier;
    } catch (error) {
        console.error("Error deleting supplier: ", error);
        throw error;
    }
};


//   // Soft remove account ( delete supplier account )
// module.exports.softDelete = async (supplierId, updatedData) => {
//     try {
//         return await Supplier.findByIdAndUpdate(supplierId, updatedData,{ new: true, runValidators: true });
//     } catch (error) {
//         console.error("Error deleting supplier: ", error);
//         throw error;
//     }
// };
  
  