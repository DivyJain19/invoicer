const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

exports.addProduct = asyncHandler(async (req, res) => {
  const { product_name, unit, buyer_percentage, seller_percentage } = req.body;
  if (!product_name) {
    res.status(400);
    throw new Error('Please provide a Product name');
  }
  try {
    const productExists = await Product.findOne({ product_name });
    if (productExists) {
      res.status(400);
      res.json({
        message: 'Product already Exists',
      });
    } else {
      try {
        const product = await Product.create({
          product_name,
          unit: unit ? unit : 'Bori',
          buyer_percentage: buyer_percentage || 0,
          seller_percentage: seller_percentage || 0,
        });
        if (product) {
          res.status(201).json({
            product_id: product._id,
            message: 'Product Added Successfully!',
          });
        } else {
          res.status(400);
          throw new Error('Error Occoured');
        }
      } catch (err) {
        res.status(400);
        throw new Error('Error Occoured');
      }
    }
  } catch (err) {
    res.status(400);
    throw new Error('Error Occoured');
  }
});

exports.editProduct = asyncHandler(async (req, res) => {
  const { product_name, unit, buyer_percentage, seller_percentage } = req.body;
  const id = req.params.product_id;
  if (!product_name) {
    res.status(400);
    throw new Error('Please provide a Product name');
  }
  try {
    const productExists = await Product.findOne({
      product_name,
      _id: { $ne: id },
    });

    if (productExists) {
      res.status(400);
      res.json({
        message: 'Product already Exists',
      });
    } else {
      try {
        const product = await Product.findOneAndUpdate(
          { _id: id },
          {
            product_name,
            unit: unit ? unit : 'Bori',
            buyer_percentage: buyer_percentage || 0,
            seller_percentage: seller_percentage || 0,
          }
        );
        if (product) {
          res.status(201).json({
            product_id: product._id,
            message: 'Product Updated Successfully!',
          });
        } else {
          res.status(400);
          throw new Error('Error Occoured');
        }
      } catch (err) {
        res.status(400);
        throw new Error('Error Occoured');
      }
    }
  } catch (err) {
    res.status(400);
    throw new Error('Error Occoured');
  }
});

exports.getProductList = asyncHandler(async (req, res) => {
  try {
    const productList = await Product.find()
      .select('-__v')
      .sort({ product_name: 1 });
    if (productList && productList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: productList.length,
        data: {
          productList,
        },
      });
    } else {
      res.status(201);
      res.json({
        status: 'Failed',
        data: {
          message: 'No Products Found!',
        },
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error('Error Occoured');
  }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deleteProd = await Product.findByIdAndDelete(req.params.product_id);
    if (!deleteProd) {
      res.json({
        status: 'Failed',
        data: {
          message: 'No Product Found!',
        },
      });
    } else {
      res.status(204).json({
        status: 'Success',
        data: null,
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error('Error Occoured');
  }
});
