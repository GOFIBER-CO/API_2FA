const { query } = require("express");
const { isValidObjectId } = require("mongoose");
const Categories = require("../../database/entities/Categories");
const Posts = require("../../database/entities/Posts");
const Tags = require("../../database/entities/Tags");
const Menus = require("../../database/entities/Menus");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");

async function createPost(req, res) {
  if (req.actions.includes("createPost")) {
    try {
      let post = new Posts(req.body);
      post.createdTime = Date.now();
      await post.save((err, newPost) => {
        if (err) {
          let response = new ResponseModel(-2, err.message, err);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Create post success!", newPost);
          res.json(response);
        }
      });
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function updatePost(req, res) {
  if (req.actions.includes("updatePost")) {
    try {
      let newPost = { updatedTime: Date.now(), user: req.userId, ...req.body };
      let updatedPost = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        newPost
      );
      if (!updatedPost) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Update post success!", newPost);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function deletePost(req, res) {
  if (req.actions.includes("deletePost")) {
    if (isValidObjectId(req.params.id)) {
      try {
        let post = await Posts.findByIdAndDelete(req.params.id);
        if (!post) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete post success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
      }
    } else {
      res
        .status(404)
        .json(new ResponseModel(404, "PostId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function getPagingPosts(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search && req.query.status) {
    searchObj = {
      status: req.query.status,
      $or: [
        { title: { $regex: ".*" + req.query.search + ".*" } },
        { slug: { $regex: ".*" + req.query.search + ".*" } },
        { description: { $regex: ".*" + req.query.search + ".*" } },
      ],
    };
  }
  if (req.query.search || req.query.status) {
    if (req.query.search) {
      searchObj = {
        $or: [
          { title: { $regex: ".*" + req.query.search + ".*" } },
          { slug: { $regex: ".*" + req.query.search + ".*" } },
          { description: { $regex: ".*" + req.query.search + ".*" } },
        ],
      };
    } else {
      searchObj = {
        status: req.query.status,
      };
    }
  }

  try {
    let posts = await Posts.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("tags")
      .populate("user")
      .populate("menu")

      .select(
        "_id title slug description thumb category createdTime numberOfReader user"
      )
      .sort({
        createdTime: "desc",
      });
    posts = posts.map((post) => {
      if (post.user != undefined && post.user != null && post.user != "") {
        post.user.password = "";
        return post;
      } else {
        return post;
      }
    });
    // let count = await Posts.find(searchObj).countDocuments();
    let count = posts.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, posts);

    res.json(pagedModel);
  } catch (error) {
    console.log(error);
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}

async function getPagingPostsV2(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.status) {
    searchObj.status = req.query.status;
  }
  if (req.query.title) {
    searchObj.title = { $regex: ".*" + req.query.title + ".*" };
  }
  if (req.query.slug) {
    searchObj.slug = { $regex: ".*" + req.query.slug + ".*" };
  }
  if (req.query.description) {
    searchObj.description = { $regex: ".*" + req.query.description + ".*" };
  }
  try {
    let posts = await Posts.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("tags")
      .populate("user")
      .populate("menu")
      .select("-content")
      
   
      .exec()
    let menuList = await Menus.find({});

    posts = posts.map((post) => {
      if (post.menu.parent != null) {
        let parent = menuList.find(
          (item) => item.id.toString() == post.menu.parent.toString()
        );
        post.menu.parent = parent;
      }

      if (post.user) {
        post.user.password = "";
        return post;
      } else {
        return post;
      }
    });
     posts = posts.sort((a, b) => {
      return b.createdTime - a.createdTime;
    });
    // let count = await Posts.find(searchObj).countDocuments();
    let count = posts.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, posts);

    res.json(pagedModel);
  } catch (error) {
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}

async function getPostById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let post = await Posts.findById(req.params.id)
        .populate("tags")
        .populate("user")
        .populate("menu");
      let menu = await Menus.find({ _id: post.menu._id });
      if (menu.parent != null) {
        let menuParent = await Menus.find({ _id: menu.parent.id });
        post.menu.parent = menuParent;
        console.log(menuParent);
      }
      if (post) {
        // post.user.password = "";
        res.json(post);
      } else {
        res
          .status(404)
          .json(new ResponseModel(404, "Post was not found", null));
      }
    } catch (error) {
      res.status(404).json(new ResponseModel(404, error.message, error));
    }
  } else {
    res.status(404).json(new ResponseModel(404, "PostId is not valid!", null));
  }
}

async function getPostBySlug(req, res) {
  let post = await Posts.findOne({ slug: req.params.slug })
    .populate("tags")
    .populate("user")
    .populate("menu");
  if (post) {
    //post.user.password = '';
    post.numberOfReader += 1;
    console.log(post.numberOfReader);
    await post.save();
    res.json(post);
  } else {
    res.status(404).json(404, "Post was not found", null);
  }
}

async function getPostsByMenuSlug(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  Menus.find({ menuSlug: req.params.menuSlug })
    .populate("parent")
    .exec((error, menu) => {
      if (error) {
        res.status(404).json(new ResponseModel(404, error.message, error));
      } else {
        if (menu) {
          console.log(menu);
          let searchObj;
          if (menu.length >= 2) {
            menu = menu.filter(
              (item) => item?.parent?.menuSlug === req.query.parent
            );
            searchObj = {
              status: 1,
              menu: menu[0]?._id,
            };

            if (req.query.search) {
              searchObj = {
                status: 1,
                menu: menu[0]?._id,
                title: { $regex: ".*" + req.query.search + ".*" },
              };
            }
          } else {
            searchObj = {
              status: 1,
              menu: menu[0]?._id,
            };

            if (req.query.search) {
              searchObj = {
                status: 1,
                menu: menu[0]?._id,
                title: { $regex: ".*" + req.query.search + ".*" },
              };
            }
          }
          Posts.find(searchObj)
            .skip(pageSize * pageIndex - pageSize)
            .limit(parseInt(pageSize))
            .populate("tags")
            .populate("user")
            .populate("menu")

            .select(
              req.params.menuSlug === "video"
                ? "_id title slug description content thumb menu createdTime numberOfReader user"
                : "_id title slug description thumb menu createdTime numberOfReader user"
            )
            .sort({
              createdTime: "desc",
            })
            .exec((err, posts) => {
              if (error) {
                res
                  .status(404)
                  .json(new ResponseModel(404, error.message, error));
              } else {
                posts = posts.map((post) => {
                  if (
                    post.user != undefined &&
                    post.user != null &&
                    post.user != ""
                  ) {
                    post.user.password = "";
                    return post;
                  } else {
                    return post;
                  }
                });
                let totalPages = Math.ceil(posts.length / pageSize);
                let pagedModel = new PagedModel(
                  pageIndex,
                  pageSize,
                  totalPages,
                  posts
                );
                res.json(pagedModel);
                // Posts.find(searchObj).countDocuments((err, count) => {
                //   if (error) {
                //     res
                //       .status(404)
                //       .json(new ResponseModel(404, error.message, error));
                //   } else {
                //     let totalPages = Math.ceil(count / pageSize);
                //     let pagedModel = new PagedModel(
                //       pageIndex,
                //       pageSize,
                //       totalPages,
                //       posts
                //     );
                //     res.json(pagedModel);
                //   }
                // });
              }
            });
        } else {
          res
            .status(404)
            .json(new ResponseModel(404, "Menu was not found!", null));
        }
      }
    });
}

async function getPostsByCategorySlug(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  Categories.findOne(
    { categorySlug: req.params.categorySlug },
    (error, category) => {
      if (error) {
        res.status(404).json(new ResponseModel(404, error.message, error));
      } else {
        if (category) {
          let searchObj = {
            status: 1,
            category: category._id,
          };

          if (req.query.search) {
            searchObj = {
              status: 1,
              category: category._id,
              title: { $regex: ".*" + req.query.search + ".*" },
            };
          }

          Posts.find(searchObj)
            .skip(pageSize * pageIndex - pageSize)
            .limit(parseInt(pageSize))
            .populate("tags")
            .populate("user")
            .populate("menu")

            .select(
              req.params.categorySlug === "video"
                ? "_id title slug description content thumb category createdTime numberOfReader user"
                : "_id title slug description thumb category createdTime numberOfReader user"
            )
            .sort({
              createdTime: "desc",
            })
            .exec((err, posts) => {
              if (error) {
                res
                  .status(404)
                  .json(new ResponseModel(404, error.message, error));
              } else {
                posts = posts.map((post) => {
                  if (
                    post.user != undefined &&
                    post.user != null &&
                    post.user != ""
                  ) {
                    post.user.password = "";
                    return post;
                  } else {
                    return post;
                  }
                });
                let totalPages = Math.ceil(posts.length / pageSize);
                let pagedModel = new PagedModel(
                  pageIndex,
                  pageSize,
                  totalPages,
                  posts
                );
                res.json(pagedModel);
                // Posts.find(searchObj).countDocuments((err, count) => {
                //   if (error) {
                //     res
                //       .status(404)
                //       .json(new ResponseModel(404, error.message, error));
                //   } else {
                //     let totalPages = Math.ceil(count / pageSize);
                //     let pagedModel = new PagedModel(
                //       pageIndex,
                //       pageSize,
                //       totalPages,
                //       posts
                //     );
                //     res.json(pagedModel);
                //   }
                // });
              }
            });
        } else {
          res
            .status(404)
            .json(new ResponseModel(404, "Category was not found!", null));
        }
      }
    }
  );
}

async function getPostsByTagSlug(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  Tags.findOne({ tagSlug: req.params.tagSlug }, (error, tag) => {
    if (error) {
      res.status(404).json(new ResponseModel(404, error.message, error));
    } else {
      if (tag) {
        let searchObj = {
          status: 1,
          tags: tag._id,
        };

        if (req.query.search) {
          searchObj = {
            status: 1,
            tags: tag._id,
            title: { $regex: ".*" + req.query.search + ".*" },
          };
        }
        Posts.find(searchObj)
          .skip(pageSize * pageIndex - pageSize)
          .limit(parseInt(pageSize))
          .select("-content")
          .populate("tags")
          .populate("user")
          .populate("menu")

          .sort({
            createdTime: "desc",
          })
          .exec((err, posts) => {
            if (err) {
              let response = new ResponseModel(-99, err.message, err);
              res.status(404).json(response);
            } else {
              posts = posts.map((post) => {
                if (
                  post.user != undefined &&
                  post.user != null &&
                  post.user != ""
                ) {
                  post.user.password = "";
                  return post;
                } else {
                  return post;
                }
              });
              let totalPages = Math.ceil(posts.length / pageSize);
              let pagedModel = new PagedModel(
                pageIndex,
                pageSize,
                totalPages,
                posts
              );
              res.json(pagedModel);
              // Posts.find(searchObj).countDocuments((err, count) => {
              //   if (err) {
              //     let response = new ResponseModel(-99, err.message, err);
              //     res.json(response);
              //   } else {
              //     let totalPages = Math.ceil(count / pageSize);
              //     let pagedModel = new PagedModel(
              //       pageIndex,
              //       pageSize,
              //       totalPages,
              //       posts
              //     );
              //     res.json(pagedModel);
              //   }
              // });
            }
          });
      } else {
        res
          .status(404)
          .json(new ResponseModel(404, "Tag was not found!", null));
      }
    }
  });
}

async function getRelativePosts(req, res) {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let posts = await Posts.find({
      _id: { $ne: req.params.postId },
      menu: req.query.menu,
    })
      .select("-content")
      .limit(limit)
      .sort({
        createdTime: "desc",
      });
    res.json(posts);
  } catch (error) {
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}

async function getPostsByViews(req, res) {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let posts = await Posts.find()
      .select(
        "_id title slug description thumb menu createdTime numberOfReader user"
      )
      .sort({ numberOfReader: -1 })
      .limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}

async function searchPostsByTitle(req, res) {
  try {
    let search = req.query.q;
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
    let query = {};
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
    Posts.find(query)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("tags")
      .populate("user")
      .populate("menu")

      .select(
        "_id title slug description thumb menu createdTime numberOfReader user"
      )
      .exec((err, data) => {
        if (err) {
          res.status(404).json(new ResponseModel(404, error.message, error));
        }
        return res.json(data);
      });
  } catch (error) {
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}
exports.getPostXML = (req, res) => {
  try {
    Posts.find({ post_status: 1 })
      .sort({ createdTime: -1 })
      .select("id title slug createdTime")
      .allowDiskUse(true)
      .exec((err, data) => {
        if (err) {
          dashLogger.error(`Error : ${err}, Request : ${req.originalUrl}`);
          return res.status(400).json({
            message: err.message,
          });
        }
        return res.json(data);
      });
  } catch (error) {
    dashLogger.error(`Error : ${error}, Request : ${req.originalUrl}`);
    return res.status(400).json({ message: error.message });
  }
};

async function getNumberOfReader(req, res) {
  try {
    let posts = await Posts.find()
      .limit(req.query.limit ?? 1)
      .select("-content")
      .sort({
        numberOfReader: "desc",
      });
    res.json(posts);
  } catch (error) {
    res.status(404).json(new ResponseModel(404, error.message, error));
  }
}

exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPagingPosts = getPagingPosts;
exports.getPagingPostsV2 = getPagingPostsV2;
exports.getPostById = getPostById;
exports.getPostBySlug = getPostBySlug;
exports.getPostsByMenuSlug = getPostsByMenuSlug;
exports.getPostsByCategorySlug = getPostsByCategorySlug;
exports.getPostsByTagSlug = getPostsByTagSlug;
exports.getRelativePosts = getRelativePosts;
exports.getPostsByViews = getPostsByViews;
exports.searchPostsByTitle = searchPostsByTitle;

exports.getNumberOfReader = getNumberOfReader;
