const { createorder } = require("../services/order.service");
const router = require("express").Router();
const orderservice = require("../services/order.service");

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
};

router.post("/order/addneworder", routes.addneworder);

module.exports = router;
