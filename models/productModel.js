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
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
