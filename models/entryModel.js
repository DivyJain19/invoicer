const mongoose = require('mongoose');
const lineSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: [true, 'Product Name is required'],
  },
  product_quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  price: {
    type: Number,
  },
  buyer_rate: {
    type: Number,
  },
  seller_rate: {
    type: Number,
  },
  buyer_brokerage: {
    type: Number,
  },
  seller_brokerage: {
    type: Number,
  },
  amount: {
    type: Number,
  },
});
const entrySchema = mongoose.Schema({
  buyer_name: {
    type: String,
    required: [true, 'Buyer is required'],
  },
  seller_name: {
    type: String,
    required: [true, 'Seller is required'],
  },
  entry_date: {
    type: Date,
    required: [true, 'Entry Date is required'],
  },
  userId: {
    type: String,
    required: [true, 'User ID is Required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  lineitems: [lineSchema],
});
const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;
