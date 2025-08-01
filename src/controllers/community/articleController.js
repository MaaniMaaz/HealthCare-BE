const SuccessHandler = require("../../utils/SuccessHandler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Article = require("../../models/community/article");
const cloud = require("../../functions/cloudinary");
const path = require("path");

const createArticle = async (req, res) => {
  // #swagger.tags = ['article']
  try {
    const { title, description } = req.body;
    const { _id } = req.user;


    let fileUrls = [];

    if (req.files?.files?.length > 0) {
      // Upload all files concurrently
      fileUrls = await Promise.all(
        req.files.files.map(async (file) => {
          const filePath = `${Date.now()}-${path.parse(file.originalname).name}`;
          const uploaded = await cloud.uploadStreamImage(file.buffer, filePath);
          return uploaded.secure_url;
        })
      );
    }

    const newArticle = await Article.create({
      title,
      description,
      user: _id,
      files: fileUrls, 
    });

    return SuccessHandler(newArticle, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateArticle = async (req, res) => {
  // #swagger.tags = ['article']
  try {
    const { id } = req.params;
    const {
      title,
      description,
    } = req.body;
    console.log(req.body)

    const existingArticle = await Article.findById(id);

    if (!existingArticle) {
      return ErrorHandler("Article not found", 404, req, res);
    }

     let fileUrls = [];

    if (req.files?.files?.length > 0) {
      // Upload all files concurrently
      fileUrls = await Promise.all(
        req.files.files.map(async (file) => {
          const filePath = `${Date.now()}-${path.parse(file.originalname).name}`;
          const uploaded = await cloud.uploadStreamImage(file.buffer, filePath);
          return uploaded.secure_url;
        })
      );
    }

    existingArticle.title = title ||  existingArticle.title;
    existingArticle.description = description ||  existingArticle.description;
   

    await existingArticle.save();

    return SuccessHandler(existingArticle, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getArticleById = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const { id } = req.params;

    const article = await Article.findById(id)

    if (!article) {
      return ErrorHandler("Article not found", 404, req, res);
    }

    return SuccessHandler(article, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteArticle = async (req, res) => {
  // #swagger.tags = ['article']
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return ErrorHandler("Article not found", 404, req, res);
    }

    return SuccessHandler({ message: "Article deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};



module.exports = {
  createArticle,
  updateArticle,
  getArticleById,
  deleteArticle,
};