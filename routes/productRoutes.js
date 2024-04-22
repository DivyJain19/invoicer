const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/addProduct/:userId').post(productController.addProduct);
router.route('/getProductList/:userId').get(productController.getProductList);
router
  .route('/deleteProduct/:product_id/:userId')
  .delete(productController.deleteProduct);
router
  .route('/editProduct/:product_id/:userId')
  .put(productController.editProduct);

module.exports = router;
