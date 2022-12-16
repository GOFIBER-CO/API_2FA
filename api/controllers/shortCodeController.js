const ShortCodes = require('../../database/entities/ShortCodes');
const PagedModel = require('../models/PagedModel');
const ResponseModel = require('../models/ResponseModel');
const { isValidObjectId } = require('mongoose');

async function createShortCode(req, res) {
    if (req.actions.includes('createShortCode')) {
        try {
            let shortCode = new ShortCodes(req.body);
            shortCode.createdTime = Date.now();
            shortCode.user = req.userId;
            let newShortCode = await shortCode.save();
            let response = new ResponseModel(1, 'Create shortcode success!', newShortCode);
            res.json(response);
        } catch (error) {
            let response = new ResponseModel(404, error.message, error);
            res.status(404).json(response);
        }
    }
    else {
        res.sendStatus(403);
    }
}

async function updateShortCode(req, res) {
    if (req.actions.includes('updateShortCode')) {
        try {
            let newShortCode = { updatedTime: Date.now(), user: req.userId, ...req.body };
            let updatedShortCode = await ShortCodes.findOneAndUpdate({ _id: req.params.id }, newShortCode);
            if (!updatedShortCode) {
                let response = new ResponseModel(0, 'No item found!', null)
                res.json(response);
            }
            else {
                let response = new ResponseModel(1, 'Update shortcode success!', newShortCode)
                res.json(response);
            }
        }
        catch (error) {
            let response = new ResponseModel(404, error.message, error)
            res.status(404).json(response);
        }
    }
    else {
        res.sendStatus(403);
    }
}

async function deleteShortCode(req, res) {
    if (req.actions.includes('deleteShortCode')) {
        if (isValidObjectId(req.params.id)) {
            try {
                let shortCode = await ShortCodes.findByIdAndDelete(req.params.id);
                if (!shortCode) {
                    let response = new ResponseModel(0, 'No item found!', null);
                    res.json(response);
                }
                else {
                    let response = new ResponseModel(1, 'Delete shortcode success!', null);
                    res.json(response);
                }
            } catch (error) {
                let response = new ResponseModel(-99, error.message, error)
                res.json(response);
            }
        }
        else {
            res.status(404).json(new ResponseModel(404, 'ShortCodeId is not valid!', null));
        }
    }
    else {
        res.sendStatus(403);
    }
}

async function getPagingShortCodes(req, res) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
    let search = req.query.search;
    let searchObj = {}
    if (req.query.search) {
        searchObj = {
            name: { $regex: '.*' + req.query.search + '.*' }
        }
    }

    try {
        let shortCodes = await ShortCodes
            .find(searchObj)
            .skip((pageSize * pageIndex) - pageSize)
            .limit(parseInt(pageSize))
            .populate("user")
            .sort({
                createdTime: 'desc'
            });

            shortCodes = shortCodes.map((shortcode) => {
            if (shortcode.user != undefined && shortcode.user != null && shortcode.user != '') {
                shortcode.user.password = '';
                return shortcode;
            }
            else {
                return shortcode;
            }
        });
        let count = await ShortCodes.find(searchObj).countDocuments();
        let totalPages = Math.ceil(count / pageSize);
        let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, shortCodes);
        res.json(pagedModel);
        
    } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
    }
}

async function getShortCodeById(req, res) {
    if (isValidObjectId(req.params.id)) {
        try {
            let shortCode = await ShortCodes.findById(req.params.id);
            res.json(shortCode);
        } catch (error) {
            res.status(404).json(404, error.message, error);
        }
    }
    else {
        res.status(404).json(new ResponseModel(404, 'ShortCodeId is not valid!', null));
    }
}

exports.createShortCode = createShortCode;
exports.updateShortCode = updateShortCode;
exports.deleteShortCode = deleteShortCode;
exports.getPagingShortCodes = getPagingShortCodes;
exports.getShortCodeById = getShortCodeById;