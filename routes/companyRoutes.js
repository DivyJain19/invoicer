const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController")

router.route('/addCompany').post(companyController.addCompany);
router.route('/deleteCompany/:company_id').delete(companyController.deleteCompany);
router.route('/editCompany/:company_id').put(companyController.editCompany);
router.route('/getCompanyList').get(companyController.getCompanyList);
router.route('/uploadCompanyExcel').post(companyController.importCompanyExcelData);

module.exports = router;
