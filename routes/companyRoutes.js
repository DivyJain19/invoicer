const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController")

router.route('/addCompany').post(companyController.addCompany);
router.route('/getCompanyList').get(companyController.getCompanyList);

module.exports = router;
