const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController")

router.route('/addProduct').post(productController.addProduct);
router.route('/getProductList').get(productController.getProductList);
router.route('/deleteProduct/:product_id').delete(productController.deleteProduct);


module.exports = router;
