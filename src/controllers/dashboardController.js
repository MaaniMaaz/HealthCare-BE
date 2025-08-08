const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");
const Article = require("../models/community/article");

const stats = async (req,res) => {
  // #swagger.tags = ['dashboard']
  try {
   
   const userCount = await User.countDocuments({ role: "user" });

const articleCount = await Article.countDocuments({
  user: { $ne: "6895c5dfc1b792c5581a9691" }
});
    const stats = {
        userCount,
        articleCount
    }
    return SuccessHandler(stats, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  stats
};
