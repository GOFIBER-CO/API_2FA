// const { isValidObjectId } = require("mongoose");
const Profile = require("../../database/entities/GroupProfile");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");


async function createProfile(req, res) {
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
      console.log(error);
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
    //   } else {
    //     res.sendStatus(403);
    //   }
  }

  async function getPagingProfile(req, res) {
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


  exports.createProfile = createProfile;
  exports.getPagingProfile = getPagingProfile;