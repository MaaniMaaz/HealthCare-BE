const express = require("express");
const router = express.Router();
const article = require("../../controllers/community/articleController");
const { isAuthenticated } = require("../../middleware/auth");
const uploader = require("../../utils/uploader");

router
  .route("/")
  .post(
    isAuthenticated,
    uploader.fields([{ name: "files", maxCount: 3 }]),
    article.createArticle
  );
router.route("/:id").get(article.getArticleById);
router
  .route("/:id")
  .put(
    isAuthenticated,
    uploader.fields([{ name: "files", maxCount: 3 }]),
    article.updateArticle
  );
router.route("/:id").delete(article.deleteArticle);

router.route("/like/:id").get(isAuthenticated, article.likeArticle);
router.route("/dislike/:id").get(isAuthenticated, article.dislikeArticle);

module.exports = router;
