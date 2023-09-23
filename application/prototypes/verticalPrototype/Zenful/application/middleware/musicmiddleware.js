const { getNRecentPosts,getMusicById,getSavedMusic } = require("../models/Music");
const musicMiddleware = {};
const MusicModel = require("../models/Music");

musicMiddleware.getSavedMusic = async function (req, res, next) {
  try {
    // Allows for users that are logged in to see only their journals
    const userId = req.session.userId;
    const userMusic = await MusicModel.getSavedMusic(userId);

    res.locals.results = userMusic;
    let results = await getNRecentPosts(8);
    if (results.length == 0) {
      req.flash("error", "There are no journal entries created yet");
    }
    next();
  } catch (err) {
    next(err);
  }
};


musicMiddleware.getJournalById = async function (req, res, next) {
  try {
    let journalId = req.params.id;
    let results = await getMusicById(journalId);
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

module.exports = musicMiddleware;
