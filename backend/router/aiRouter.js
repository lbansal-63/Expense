const router = require('express').Router();
const controller = require('../controller/aiController');

router.post('/advice', controller.getFinancialAdvice);

module.exports = router;
