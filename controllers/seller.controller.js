const express =require('express');
const sellerService = require("../services/seller.service");
const dashboardService = require('../services/dashboard.service');


    const router =express.Router();
    // get all sellers
    router.get("/sellers", async (req, res) => {
        try {
            const sellers = await sellerService.getSellers();
            res.status(200).json(sellers)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // get seller by id
    router.get("/seller/:id", async (req, res) => {
        try {
            const seller = await sellerService.getSellerById(req.params.id)
            if (!seller) return res.status(404).json({ error: 'seller not found' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

    // create seller
    router.post("/sellers", async (req, res) => {
        try {
            const newSeller = await sellerService.createSeller(req.body)
            res.status(201).json(newSeller)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    })


    // update seller
    router.post("/sellers/:id", async (req, res) => {
        try {
            const updateSeller = await sellerService.updateSeller(req.params.id, req.body)
            if (!updateSeller) return res.status(404).json({ error: 'Seller not found' });
            res.status(201).json(updateSeller)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    })

    // delete seller
    router.post("/sellers/:id", async (req, res) => {
        try {
            const deleteSeller = await sellerService.deleteSeller(req.params.id)
            if (!deleteSeller) return res.status(404).json({ error: 'Seller not found' });
            res.status(201).json({ message: 'Seller deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    })


    
      

router.get('/dashboard/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const stats = await sellerService.getSellerDashboardStats(sellerId);
        
        if (!stats) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.json(stats);
    } catch (error) {
        console.error("Error fetching seller dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/stats/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const stats = await sellerService.getSellerSalesStats(sellerId); 

        if (!stats) {
            return res.status(404).json({ message: "Seller stats not found" });
        }

        res.json(stats);
    } catch (error) {
        console.error("Error fetching seller stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




     

    module.exports= router;