const asyncHandler = require('express-async-handler');
const Company = require('../models/companyModel');

exports.addCompany = asyncHandler(async (req, res) => {
  const { company_name, location } = req.body;
  const userId = req?.params?.userId;

  const companyExists = await Company.findOne({
    company_name,
    location,
    userId,
  });
  if (companyExists) {
    res.status(400);
    res.json({
      message: 'Company already Exists',
    });
  } else {
    try {
      const company = await Company.create({
        company_name,
        location,
        userId,
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
    } catch (err) {
      console.log('err', err);
      res.status(400);
      // throw new Error('Error Occoured');
      throw new Error(err.message);
    }
  }
});

exports.getCompanyList = asyncHandler(async (req, res) => {
  try {
    const userId = req?.params?.userId;

    const companyList = await Company.find({ userId })
      .select('-__v')
      .sort({ company_name: 1 });
    if (companyList && companyList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: companyList.length,
        data: {
          companyList,
        },
      });
    } else {
      res.status(201).json({
        status: 'Success',
        results: companyList.length,
        data: {
          companyList: [],
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});

exports.deleteCompany = asyncHandler(async (req, res) => {
  try {
    const deleteComp = await Company.findByIdAndDelete(req.params.company_id);
    if (!deleteComp) {
      res.status(400);
      res.json({
        message: 'Company does not Exists',
      });
    } else {
      res.status(204).json({
        status: 'Success',
        data: null,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});

exports.editCompany = asyncHandler(async (req, res) => {
  const { company_name, location } = req.body;
  const userId = req?.params?.userId;

  const id = req.params.company_id;
  if (!company_name) {
    res.status(400);
    throw new Error('Please provide a Company name');
  }
  try {
    const companyExists = await Company.findOne({
      company_name,
      _id: { $ne: id },
      userId,
    });
    if (companyExists) {
      res.status(400);
      res.json({
        message: 'Company already Exists',
      });
    } else {
      try {
        const company = await Company.findOneAndUpdate(
          { _id: id, userId },
          {
            company_name,
            location: location || '',
            userId,
          }
        );
        if (company) {
          res.status(201).json({
            company_id: company._id,
            message: 'Company Updated Successfully!',
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

exports.importCompanyExcelData = asyncHandler(async (req, res) => {
  const companyList = req?.body?.list;
  let counter = 0;
  let arr = [];
  try {
    const userId = req?.params?.userId;
    for await (item of companyList) {
      const companyExists = await Company.findOne({
        company_name: item?.company_name,
        location: item?.location,
        userId,
      });
      if (!companyExists) {
        try {
          arr.push({
            insertOne: {
              document: {
                company_name: item?.company_name,
                location: item?.location,
                userId,
              },
            },
          });
          counter++;
        } catch (err) {
          console.log('err', err);
        }
      }
    }
    await Company.bulkWrite(arr);
    console.log('Excel Upload Complete');
    res.status(201).json({
      companiesAdded: counter,
      message: `${counter} Companies Added!`,
    });
  } catch (err) {
    res.status(400);
    res.json({
      message: 'Something Went wrong!',
    });
  }
});
