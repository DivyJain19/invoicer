const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.route('/addCompany/:userId').post(companyController.addCompany);
router
  .route('/deleteCompany/:company_id/:userId')
  .delete(companyController.deleteCompany);
router
  .route('/editCompany/:company_id/:userId')
  .put(companyController.editCompany);
router.route('/getCompanyList/:userId').get(companyController.getCompanyList);
router
  .route('/uploadCompanyExcel/:userId')
  .post(companyController.importCompanyExcelData);

module.exports = router;
