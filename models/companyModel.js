const mongoose = require('mongoose');
const companySchema = mongoose.Schema({
  company_name: {
    type: String,
    required: [true, 'A Company Must have a name'],
  },
  location: {
    type: String,
  },
  userId: {
    type: String,
    required: [true, 'User ID is Required'],
  },
});
const Company = mongoose.model('Company', companySchema);
module.exports = Company;
