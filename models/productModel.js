const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: [true, 'A Product Must have a name'],
  },
  unit: {
    type: String,
    default: 'bori',
  },
  buyer_percentage : {
    type: Number,
  },
  seller_percentage : {
    type: Number,
  }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
