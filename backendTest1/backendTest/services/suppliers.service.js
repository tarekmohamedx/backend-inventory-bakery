 const supplierRepo = require('../repos/suppliers.repo');
 
 module.exports.getSupplier = async () => {
     return await supplierRepo.getSupplier();
 };
 
 module.exports.getSupplierById = async (supplierId) => {
     return await supplierRepo.getSupplierById(supplierId);
 };
 
 module.exports.createSupplier = async (supplierData) => {
     return await supplierRepo.createSupplier(supplierData);
 };
 
 module.exports.updateSupplier = async(supplierId, updatedData) => {
     return await supplierRepo.updateSupplier(supplierId, updatedData);
 };
    
 module.exports.deleteSupplier = async (supplierId) => {
     return await supplierRepo.deleteSupplier(supplierId);
 };

//  module.exports.softDelete = async (supplierId) => {
//     return await supplierRepo.softDelete(supplierId, { status: "inactive" });
// };