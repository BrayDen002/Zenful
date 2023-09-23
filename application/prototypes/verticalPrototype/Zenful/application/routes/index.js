var express = require("express");
const db = require("../config/db");
var router = express.Router();
var isLoggedIn = require("../middleware/routeprotectors").userIsLoggedIn;
const {
  getRecentJournals,
  getJournalById,
} = require("../middleware/postsmiddleware");
const PostModel = require("../models/Posts");
const {
  getMusicSavedById,
  getMusicById,
} = require("../middleware/musicmiddleware");
const MusicModel = require("../models/Music");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("home", { title: "Zenful", name: "Team 02"});
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/registration", (req, res, next) => {
  res.render("registration");
});

// router.use("/savedjournals", isLoggedIn);
router.get("/savedjournals", isLoggedIn, getRecentJournals, (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userJournals = PostModel.getJournalsByUserId(userId);
    res.render("savedjournals", { title: "Zenful", name: "Team 02", journals: userJournals, });
  } catch (err) {
    next(err);
  }
});

router.use("/createjournal", isLoggedIn);
router.get("/createjournal", (req, res, next) => {
  res.render("createjournal");
});

router.get("/viewjournal", (req, res, next) => {
  res.render("viewjournal");
});

router.get("/posts", (req, res, next) => {
  res.render("viewjournal");
});



router.get("/post/:id(\\d+)", getJournalById, (req, res, next) => {
  res.render("viewjournal", {
    title: `Post ${req.params.id}`,
  });
});

module.exports = router;
