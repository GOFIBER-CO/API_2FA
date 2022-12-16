const RoleActions = require('../../database/entities/authentication/RoleActions');
const Roles = require('../../database/entities/authentication/Roles');
const ResponseModel = require('../models/ResponseModel');
const PagedModel = require('../models/PagedModel');
const Users = require('../../database/entities/authentication/Users');
const { isValidObjectId } = require('mongoose');
require("dotenv").config();

async function createRoleAction(req, res) {
    if (req.actions.includes('createRoleAction')) {
        try {
            let role = await Roles.findById(req.body.role);
            if (role) {
                let exists = await RoleActions.find({ role: req.body.role, action: req.body.action })
                if (exists.length > 0) {
                    res.json(new ResponseModel(0, 'RoleAction was existed!', null));
                }
                else {
                    let roleAction = new RoleActions(req.body);
                    roleAction.createdTime = Date.now();
                    await roleAction.save((err, newRoleAction) => {
                        if (err) {
                            let response = new ResponseModel(-2, err.message, err);
                            res.json(response);
                        }
                        else {
                            let response = new ResponseModel(1, 'Create roleaction success!', newRoleAction);
                            res.json(response);
                        }
                    });
                }
            }
            else {
                res.status(404).json(new ResponseModel(404, "Role was not found", null));
            }
        } catch (error) {
            let response = new ResponseModel(404, error.message, error);
            res.status(404).json(response);
        }
    }
    else {
        res.sendStatus(403);
    }
}

async function createRoleActions(req, res) {
    if (req.actions.includes('createRoleActions')) {
        try {
            let role = await Roles.findById(req.body.role);
            if (role) {
                //Delete all old RoleActions
                await RoleActions.deleteMany({ role: req.body.role })

                let strActions = req.body.actions;
                let actions = strActions.split(',');
                if (actions.length > 0) {
                    let newRoleActions = [];
                    actions.forEach((action, index) => {
                        let roleAction = new RoleActions({ role: req.body.role, action: action.trim() });
                        roleAction.createdTime = Date.now();
                        roleAction.save();
                        newRoleActions.push(roleAction);
                    });
                    let response = new ResponseModel(1, 'Create roleaction success!', newRoleActions);
                    res.json(response);
                }
                else {
                    res.status(400).json(new ResponseModel(400, "Actions is null or empty", null));
                }
            }
            else {
                res.status(404).json(new ResponseModel(404, "Role was not found", null));
            }
        } catch (error) {
            let response = new ResponseModel(404, error.message, error);
            res.status(404).json(response);
        }
    }
    else {
        res.sendStatus(403);
    }
}

async function deleteRoleAction(req, res) {
    if (req.actions.includes('deleteRoleAction')) {
        if (isValidObjectId(req.params.id)) {
            try {
                const roleAction = await RoleActions.findByIdAndDelete(req.params.id);
                if (!roleAction) {
                    let response = new ResponseModel(0, 'No item found!', null);
                    res.json(response);
                }
                else {
                    let response = new ResponseModel(1, 'Delete roleaction success!', null);
                    res.json(response);
                }

            } catch (error) {
                let response = new ResponseModel(404, error.message, error);
                res.status(404).json(response);
            }
        }
        else {
            res.status(404).json(new ResponseModel(404, 'RoleActionId is not valid!', null));
        }
    }
    else {
        res.sendStatus(403);
    }
}

function getPagingRoleActionsByUserId(req, res) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;

    if (req.query.userId) {
        Users.findById(req.query.userId, (error, user) => {
            if (error) {
                res.status(404).json(new ResponseModel(404, error.message, error));
            }
            else {
                if (user) {
                    let searchObj = {
                        role: user.role._id
                    }
                    RoleActions
                        .find(searchObj)
                        .skip((pageSize * pageIndex) - pageSize)
                        .limit(parseInt(pageSize))
                        .populate('role')
                        .populate('action')
                        .sort({
                            createdTime: 'desc'
                        })
                        .exec((err, roleActions) => {
                            if (err) {
                                let response = new ResponseModel(-99, err.message, err);
                                res.json(response);
                            }
                            else {
                                RoleActions.find(searchObj).countDocuments((err, count) => {
                                    if (err) {
                                        let response = new ResponseModel(-99, err.message, err);
                                        res.json(response);
                                    }
                                    else {
                                        let totalPages = Math.ceil(count / pageSize);
                                        let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, roleActions);
                                        res.json(pagedModel);
                                    }
                                });
                            }
                        });
                }
                else {
                    res.status(404).json(new ResponseModel(404, 'User was not found!', null));
                }
            }
        })
    }
    else {
        res.status(404).json(new ResponseModel(404, "Not found userId in query params!", null));
    }
}

async function getPagingRoleActions(req, res) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
    let searchObj = {};
    if (req.query.roleId) {
        searchObj = {
            role: req.query.roleId
        }
    }

    try {
        let roleActions = await RoleActions
            .find(searchObj)
            .skip((pageSize * pageIndex) - pageSize)
            .limit(parseInt(pageSize))
            .populate('role')
            .populate('action')
            .sort({
                createdTime: 'desc'
            });

        let count = await RoleActions.countDocuments();
        let totalPages = Math.ceil(count / pageSize);
        let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, roleActions);
        res.json(pagedModel);
    } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
    }
}

exports.createRoleAction = createRoleAction;
exports.createRoleActions = createRoleActions;
exports.deleteRoleAction = deleteRoleAction;
exports.getPagingRoleActions = getPagingRoleActions;
exports.getPagingRoleActionsByUserId = getPagingRoleActionsByUserId;

