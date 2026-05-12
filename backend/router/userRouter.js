const express = require('express');
const { loginController, logoutController, signupContorller, updateUserController } = require('../controller/userController');
const router = express.Router();

router.post('/login' ,loginController);
router.get('/logout', logoutController);
router.post('/signup', signupContorller);
router.put('/update', updateUserController);

module.exports = router;