const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authorize, postController.createPost);
router.put("/update/:id", middlewares.authorize, postController.updatePost);
router.delete("/delete/:id", middlewares.authorize, postController.deletePost);
router.get("/getById/:id", postController.getPostById);
router.get("/getBySlug/:slug", postController.getPostBySlug);
router.get("/getPaging", postController.getPagingPosts);
router.get("/getPagingV2", postController.getPagingPostsV2);
router.get("/getByMenuSlug/:menuSlug", postController.getPostsByMenuSlug);
router.get(
  "/getByCategorySlug/:categorySlug",
  postController.getPostsByCategorySlug
);
router.get("/getByTagSlug/:tagSlug", postController.getPostsByTagSlug);
router.get("/getReletivePosts/:postId", postController.getRelativePosts);
router.get("/getNumberOfReader", postController.getNumberOfReader);
router.get("/getPostsByViews", postController.getPostsByViews);
router.get("/searchPostsByTitle", postController.searchPostsByTitle);
router.get("/getPosts/sitemap", postController.getPostXML);
module.exports = router;
