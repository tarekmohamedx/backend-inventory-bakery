const { getallorder } = require("../repos/order.repo");
const { createorder } = require("../services/order.service");
const router = require("express").Router();
const orderservice = require("../services/order.service");
const Order = require('../models/orders.model');
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
}

};

router.post("/order/addneworder", routes.addneworder);
router.get("/order/getallorder", routes.getallorder);
router.get("/order/getorderbyid/:id", routes.getorderbyid);
router.patch("/order/changeorderstatus/:id" , routes.changeorderstatus);
module.exports = router;
