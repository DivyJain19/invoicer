const mongoose = require('mongoose');
const companySchema = mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, 'A Company Must have a name'],
    },
    location: {
      type: String,
      required: [true, 'A Company Must have a location'],
    },
  },
);
const Company = mongoose.model('Company', companySchema);
module.exports = Company;
