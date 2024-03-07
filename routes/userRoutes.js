const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/signup').post(userController.registerUser);
router.route('/login').post(userController.authUser);

module.exports = router;
