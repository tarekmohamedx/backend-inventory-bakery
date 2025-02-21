const { getallorder } = require("../repos/order.repo");
const { createorder } = require("../services/order.service");
const router = require("express").Router();
const orderservice = require("../services/order.service");
const orderOfflineService = require('../services/orderOffline.service');
const Order = require('../models/orders.model');
const OrderOffline = require('../models/OrderOffline.model');
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

///---------------------------------------------------------------------------------------------------------
getOrdersBySeller: async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const ordersOnline = await orderservice.getOrdersBySeller(sellerId);
    const ordersOffline = await orderOfflineService.getOrdersBySeller(sellerId);
    console.log("online order: ", ordersOnline);
    console.log("offline order: ", ordersOffline);
    const orders =  [...ordersOnline, ...ordersOffline];
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders for seller:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

//------------------------------------------------

// TotalOrders card in seller dashboard
getTotalOrdersBySeller: async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const orders = await orderservice.getOrdersBySeller(sellerId);
    res.status(200).json({ success: true, totalOrders: orders.length });
  } catch (error) {
    console.error('Error in order controller:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
},

//------------------------------------------------

// TotalSales card in seller dashboard
getTotalSales: async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const orders = await orderservice.getOrdersBySeller(sellerId);
    let totalSales = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        totalSales += item.price * item.quantity;
      });
    });
    res.status(200).json({ success: true, totalSales });
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},

};

router.post("/order/addneworder", routes.addneworder);
router.get("/order/getallorder", routes.getallorder);
router.get("/order/getorderbyid/:id", routes.getorderbyid);
router.patch("/order/changeorderstatus/:id" , routes.changeorderstatus);

router.get("/dashboard/orders/:sellerId", routes.getOrdersBySeller);
router.get("/seller/totalOrders/:sellerId", routes.getTotalOrdersBySeller);
router.get("/seller/totalSales/:sellerId", routes.getTotalSales);

module.exports = router;
