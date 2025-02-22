const express =require('express');
const sellerService = require("../services/seller.service");


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

    // Get seller stats
    router.get('/seller-stats', async (req, res) => {
        try {
            const sellers = await sellerService.getSellers();
            console.log("Fetched sellers:", sellers);
    if (!sellers || !Array.isArray(sellers)|| sellers.length === 0) {
        console.log("No sellers found in the database.");
      throw new Error("Sellers data is not in expected array format");
    }
            const stats = sellers.map(seller => ({
                storeName: seller.storeName ,
                totalSales: seller.totalSales ,
                totalProfits: seller.totalProfits,
            }));
            res.status(200).json(stats);
        } catch (error) {
            console.error("Error in /seller-stats:", error);
            res.status(500).json({ error: error.message });
        }
    });




    module.exports= router;