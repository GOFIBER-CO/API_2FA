const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const roleActionController = require('../controllers/roleActionController');

router.post('/insert', middlewares.authorize, roleActionController.createRoleAction);
router.post('/insertMany', middlewares.authorize, roleActionController.createRoleActions);
router.delete('/delete/:id', middlewares.authorize, roleActionController.deleteRoleAction);
router.get('/getPaging', roleActionController.getPagingRoleActions);
router.get('/getPagingRoleActionsByUserId', roleActionController.getPagingRoleActionsByUserId);

module.exports = router;