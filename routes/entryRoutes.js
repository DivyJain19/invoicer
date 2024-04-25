const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');

router.route('/addEntry/:userId').post(entryController.addEntry);
router
  .route('/getEntryByCompanyName/:userId')
  .post(entryController.getEntryCompany);
router
  .route('/getEntryByCompanyNameAndDate/:userId')
  .post(entryController.getEntryCompanyByDate);
router.route('/getLastEntryDate/:userId').get(entryController.getLastEntryDate);
router.route('/getLastBuyer/:userId').get(entryController.getLastBuyer);
router.route('/getLastSeller/:userId').get(entryController.getLastSeller);
router
  .route('/deleteEntry/:id/:entryId/:userId')
  .delete(entryController.deleteEntry);
router
  .route('/generateInvoice/:company/:userId')
  .get(entryController.generateInvoice);
router
  .route('/generateInvoice/:company/:fromDate/:toDate/:userId')
  .get(entryController.generateInvoiceByDate);
router.route('/getEntryByDate/:userId').get(entryController.getEntryByDate);
router.route('/getTotalEntries/:userId').get(entryController.getTotalEntries);
router
  .route('/getAllEntriesByDate/:userId')
  .post(entryController.getAllEntriesByDate);


module.exports = router;
