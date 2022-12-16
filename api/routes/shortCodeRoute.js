const express = require('express');
const router = express.Router();
const shortCodeController = require('../controllers/shortCodeController');
const middlewares = require('./middlewares');

router.post('/insert', middlewares.authorize, shortCodeController.createShortCode);
router.put('/update/:id', middlewares.authorize, shortCodeController.updateShortCode);
router.delete('/delete/:id', middlewares.authorize, shortCodeController.deleteShortCode);
router.get('/getById/:id', shortCodeController.getShortCodeById);
router.get('/getPaging', shortCodeController.getPagingShortCodes);

module.exports = router;