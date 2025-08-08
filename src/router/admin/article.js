const express = require("express");
const router = express.Router();
const article = require("../../controllers/admin/article");
const { isAuthenticated } = require("../../middleware/auth");
const uploader = require("../../utils/uploader");

router.route("/get-all-article").get( article.getAllArticles);
router.route("/get-mine-article").get( article.getMyArticles);
router
  .route("/create-article")
  .post(
    
    uploader.fields([{ name: "files", maxCount: 3 }]),
    article.createArticle
  );
router.route("/article/:id").get(isAuthenticated,article.getArticleById);
router
  .route("/update-article/:id")
  .put(
    isAuthenticated,
    uploader.fields([{ name: "files", maxCount: 3 }]),
    article.updateArticle
  );
router.route("/article/:id").delete(isAuthenticated,article.deleteArticle);

// router.route("/like/:id").get(isAuthenticated, article.likeArticle);
// router.route("/dislike/:id").get(isAuthenticated, article.dislikeArticle);

module.exports = router;
