const { getallorder } = require("../repos/order.repo");
const { createorder } = require("../services/order.service");
const router = require("express").Router();
const orderservice = require("../services/order.service");
const Order = require('../models/orders.model');
const Product = require('../models/Product.model');
const routes = {
  addneworder: async (req, res) => {
    try {
      orderData = req.body;
      console.log(orderData);
      // const order = await createorder(orderData);
      const order = await orderservice.createorder(orderData);
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  },
  getallorder: async(req , res) =>{
try{
const order = await orderservice.getallorders();
res.status(200).json({success:true , order});
}catch(error){
res.status(500).json({message:error.message});
}
  },

  getorderbyid:async(req , res)=> {
    try{
      const id = req.params.id
const order = await orderservice.getorderbyid(id);
res.status(200).json({success:true , order});  
    }catch(error){
      res.status(500).json({message:error.message});
    }
  }, 
// app.patch('/order/updateorderstatus/:id',
  changeorderstatus: async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  try {
    const orderr = await Order.findByIdAndUpdate(id, { orderStatus: orderStatus }, { new: true });
    if (!orderr) return res.status(404).send('Order not found');
    res.send(orderr);
  } catch (error) {
    res.status(500).send(error);
  }
},

///--------------------------------------
getOrdersBySeller: async (req, res) => {
  try {
    const sellerId = req.params.sellerId;  // Get sellerId from request parameters

    // Find all products by seller
    const products = await Product.find({ sellerId: sellerId });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this seller" });
    }

    // Get all orders where productId exists in the seller's products
    const orders = await Order.find({
      "items.productId": { $in: products.map(product => product._id) }, // Filter orders by seller's product IDs
    }).populate("items.productId", "name price");

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this seller" });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders for seller:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

};

router.post("/order/addneworder", routes.addneworder);
router.get("/order/getallorder", routes.getallorder);
router.get("/order/getorderbyid/:id", routes.getorderbyid);
router.patch("/order/changeorderstatus/:id" , routes.changeorderstatus);
router.get("/dashboard/orders/:sellerId", routes.getOrdersBySeller);
module.exports = router;
