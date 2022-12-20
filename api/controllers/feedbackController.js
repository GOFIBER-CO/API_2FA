const Feedback = require("../../database/entities/Feedback");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

async function createFeedback(req, res) {
  try {
    // console.log(req.body);
    let feedback = new Feedback(req.body);
    feedback.createdTime = Date.now();
    console.log("feedback: ", feedback);
    feedback.save((err, newMenu) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(
          1,
          "Create feedback success!",
          newMenu
        );
        res.json(response);
      }
    });
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getAllFeedbacks(req, res) {
  let allFeedbacks = await Feedback.find({});
  console.log(allFeedbacks);
  res.json(allFeedbacks);
}

async function deleteFeedback(req, res) {
  // console.log(req.params, `aaa`);
  if (isValidObjectId(req.params.id)) {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);
      if (!feedback) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete feedback success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "FeedbackId is not valid!", null));
  }
}

async function updateFeedback(req, res) {
  try {
    const newFeedback = {
      updatedTime: Date(),
      ...req.body,
    };

    let updatedFeedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id },
      newFeedback
    );
    if (!updatedFeedback) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update feedback success!",
        newFeedback
      );
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingFeedbacks(req, res) {
  // console.log(`aaa`, req.query);
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  // console.log(typeof req.query.search);
  let searchObj = {};
  if (req.query.search) {
    // console.log(`co searchObj`);
    searchObj = {
      feedbackName: { $regex: ".*" + req.query.search + ".*" },
    };
  }
  console.log(searchObj);

  try {
    const feedbacks = await Feedback.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      // .populate("user")

      .sort({ createdTime: "desc" });
    // let arrayMenus = [];
    // for (let i = 0; i < menus.length; i++) {
    //   if (menus[i].parent != null) {
    //     let parentName = menus.find(
    //       (item) => item.id.toString() == menus[i].parent.toString()
    //     );
    //     menus[i].parent = parentName;
    //   }
    // }
    // res.send(feedbacks);
    // menus = menus.map((menu) => {
    //   // console.log(menus)
    //   if (menu.user != undefined && menu.user != null && menu.user != "") {
    //     menu.user.password = "";
    //     return menu;
    //   } else {
    //     return menu;
    //   }
    // });

    // let count = await Menus.find(searchObj).countDocuments();
    const count = feedbacks.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, feedbacks);

    res.json(pagedModel);
  } catch (error) {
    console.log(`loi`);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

// async function getMenuById(req, res) {
//   if (isValidObjectId(req.params.id)) {
//     try {
//       let menu = await Menus.findById(req.params.id);
//       res.json(menu);
//     } catch (error) {
//       res.status(404).json(404, error.message, error);
//     }
//   } else {
//     res.status(404).json(new ResponseModel(404, "MenuId is not valid!", null));
//   }
// }

// async function getMenuChildrenBySlug(req, res) {
//   let menuParent = await Menus.findOne({ menuSlug: req.params.slug });
//   if (menuParent) {
//     let menus = await Menus.find({ parent: menuParent._id });
//     res.json(menus);
//   } else {
//     res.status(404).json(404, "Menu was not found", null);
//   }
// }
// async function getMenuBySlug(req, res) {
//   try {
//     let menu = await Menus.findOne({ menuSlug: req.params.slug });
//     res.json(menu);
//   } catch (error) {
//     res.status(404).json(new ResponseModel(404, error.message, error));
//   }
// }
// async function getMenuByParent(req, res) {
//   try {
//     let menu = await Menus.findOne({ menuSlug: req.params.slug });
//     let menuParent = await Menus.find({ parent: menu._id });
//     res.json(menuParent);
//   } catch (error) {
//     res.status(404).json(new ResponseModel(404, error.message, error));
//   }
// }

// async function getAllMenuChildrenBySlug(req, res) {
//   try {
//     let getAllMenu = await Menus.find({ isShow: true });
//     let menuParent = await Menus.findOne({ menuSlug: req.params.slug });
//     let menuChildren = await Menus.find({ parent: menuParent._id });
//     let newMenus = [];

//     menuChildren.map((menu) => {
//       getAllMenu.filter((item) => {
//         if (item.parent) {
//           if (menu._id.equals(item.parent)) {
//             newMenus.push(item);
//           }
//         }
//       });
//     });

//     res.json(newMenus);
//   } catch (error) {
//     res.status(404).json(404, "Menu was not found", null);
//   }
// }

exports.createFeedback = createFeedback;
exports.getAllFeedbacks = getAllFeedbacks;
exports.deleteFeedback = deleteFeedback;
exports.updateFeedback = updateFeedback;
exports.getPagingFeedbacks = getPagingFeedbacks;

// exports.getMenuBySlug = getMenuBySlug;
// exports.getPagingMenus = getPagingMenus;
// exports.getMenuById = getMenuById;
// exports.getMenuChildrenBySlug = getMenuChildrenBySlug;
// exports.getMenuByParent = getMenuByParent;
// exports.getAllMenuChildrenBySlug = getAllMenuChildrenBySlug;
