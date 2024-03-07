const asyncHandler = require('express-async-handler');
const Company = require('../models/companyModel');

exports.addCompany = asyncHandler(async (req, res) => {
  const { company_name, location } = req.body;
  
  const companyExists = await Company.findOne({ company_name });
  if (companyExists) {
    res.status(400);
    throw new Error('Company already Exists');
  } else {
    try{
        const company = await Company.create({
            company_name,
            location,
          });
          if (company) {
            res.status(201).json({
              companyId: company._id,
              message: 'Company Added Successfully!',
            });
          } else {
            res.status(400);
            throw new Error('Error Occoured');
          }
    }catch(err){
        console.log("err",err)
    }
   
  }
});

exports.getCompanyList = asyncHandler(async (req, res) => {
  try {
    const companyList = await Company.find().select('-__v');
    if (companyList && companyList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: companyList.length,
        data: {
          companyList,
        },
      });
    } else {
      res.status(404);
      res.json({
        status: 'Failed',
        data: {
          message: 'No companies Found!',
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
