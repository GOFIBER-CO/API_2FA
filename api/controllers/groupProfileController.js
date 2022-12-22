const { isValidObjectId } = require("mongoose");
const Profile = require("../../database/entities/GroupProfile");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");


async function createGroupProfile(req, res) {
    //   if (req.actions.includes("createTag")) {
    try {
    //   console.log(req.user);
    //   req.body.userId = [req.user._id];
      req.body.userCreated = req.user._id;
      let profile = new Profile(req.body);
      profile.createdTime = Date.now();
      profile.save((err, newProfile) => {
        if (err) {
          let response = new ResponseModel(-2, err.message, err);
          return res.json(response);
        } else {
          let response = new ResponseModel(1, "Create profile success!", newProfile);
          return res.json(response);
        }
      });
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
   
  }

  async function getPagingGroupProfile(req, res) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
  
    let searchObj = {};
    if (req.query.search) {
      searchObj = { nameProfile: { $regex: ".*" + req.query.search + ".*" } };
    }
    try {
      let profiles = await Profile.find(searchObj)
        .skip(pageSize * pageIndex - pageSize)
        .limit(parseInt(pageSize))
        .sort({
          createdTime: "desc",
        });
    // console.log(profiles)
      let count = await Profile.find(searchObj).countDocuments();
      let totalPages = Math.ceil(count / pageSize);
      let pagedModel = new PagedModel(
        pageIndex,
        pageSize,
        totalPages,
        profiles,
        count
      );
      res.json(pagedModel);
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  }

  async function createPasswordGroupProfile(req, res) {
    try {
      // console.log(req.body,req.params)
      let newPassword = {
        updatedTime: Date.now(),
        password: req.body?.password,
        
      };
      let updatePassword = await Profile.findOneAndUpdate(
        { _id: req.params.id},
        newPassword
      );
      if (!updatePassword) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "create password success!", updatePassword);
        res.json(response);
      }
    } catch (error) {
      console.log(error);
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  }

  async function deletePasswordGroupProfile(req, res) {
    if(!req.body.password)
       return res.status(400).json(new ResponseModel(-3, "Password cannot be left blank!", null))
    try {
      // console.log(req.body,req.params)
      let newPassword = {
        updatedTime: Date.now(),
        password: '',
      };
      let checkPass = await Profile.findOne({
        password: req.body.password,
        _id: req.params.id
      })
      // console.log(checkPass)
      if(!checkPass)
        return res.status(401).json(new ResponseModel(-1, "Password not match!", null))
      let updatePassword = await Profile.findOneAndUpdate(
        { _id: req.params.id},
        newPassword
      );
      if (!updatePassword) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "update password success!", updatePassword);
        res.json(response);
      }
    } catch (error) {
      console.log(error);
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  }

  async function deleteGroupProfile(req, res) {
    console.log(req.body);
    try {
      const deleteGroupPfile = await Profile.deleteMany({
        _id: req.body._id,
       
      });
      let response = new ResponseModel(
          1,
          "Delete group profile success!",
          deleteGroupPfile
        );
        res.json(response);
    } catch (error) {
      console.log(error);
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  
  }


  exports.createGroupProfile = createGroupProfile;
  exports.getPagingGroupProfile = getPagingGroupProfile;
  exports.createPasswordGroupProfile = createPasswordGroupProfile;
  exports.deletePasswordGroupProfile = deletePasswordGroupProfile;
  exports.deleteGroupProfile = deleteGroupProfile;