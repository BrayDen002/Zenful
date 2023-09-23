const { getNRecentPosts,getJournalById } = require("../models/Posts");
const postMiddleware = {};
const PostModel = require("../models/Posts");

postMiddleware.getRecentJournals = async function (req, res, next) {
  try {
    // Allows for users that are logged in to see only their journals
    const userId = req.session.userId;
    const userJournals = await PostModel.getJournalsByUserId(userId);

    res.locals.results = userJournals;
    let results = await getNRecentPosts(8);
    if (results.length == 0) {
      req.flash("error", "There are no journal entries created yet");
    }
    next();
  } catch (err) {
    next(err);
  }
};


postMiddleware.getJournalById = async function (req, res, next) {
  try {
    let journalId = req.params.id;
    let results = await getJournalById(journalId);
    if (results && results.length) {
      res.locals.currentPost = results[0];
      next();
    } else {
      res.flash("error", "This is not the post you are looking for");
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = postMiddleware;
