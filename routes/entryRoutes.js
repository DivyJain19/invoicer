const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');

router.route('/addEntry').post(entryController.addEntry);
router.route('/getEntryByCompanyName').post(entryController.getEntryCompany);
router.route('/getLastEntryDate').get(entryController.getLastEntryDate);
router.route('/deleteEntry/:id/:entryId').delete(entryController.deleteEntry);
router.route('/generateInvoice/:company').get(entryController.generateInvoice);
router.route('/generateInvoice/:company/:fromDate/:toDate').get(entryController.generateInvoiceByDate);

module.exports = router;
