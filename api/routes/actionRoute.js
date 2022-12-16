const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const actionController = require('../controllers/actionController');

router.post('/insert', middlewares.authorize, actionController.createAction);
router.put('/update/:id', middlewares.authorize, actionController.updateAction);
router.delete('/delete/:id', middlewares.authorize, actionController.deleteAction);
router.get('/getAll', actionController.getAllActions);
router.get('/getPaging', actionController.getPagingActions);
router.get('/getById/:id', actionController.getActionById);
module.exports = router;    