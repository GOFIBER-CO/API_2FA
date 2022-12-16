const jwt = require('jsonwebtoken');
const ResponseModel = require('../models/ResponseModel');
const RoleActions = require('../../database/entities/authentication/RoleActions');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

async function authorize(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, secretKey, async (err, authorizedData) => {
            if (err) {
                let response = new ResponseModel(403, err.message, err)
                res.status(403).json(response);
            }
            else {
                if (authorizedData.user.role) {
                    let actions = await RoleActions.find({ role: authorizedData.user.role._id }).populate('action');
                    req.actions = actions.map(x => x.action.actionName);
                    req.userId = authorizedData.user._id;
                    next();
                }
                else {
                    res.sendStatus(403);
                }
            }
        });
    }
    else {
        res.sendStatus(403);
    }
}

exports.authorize = authorize;