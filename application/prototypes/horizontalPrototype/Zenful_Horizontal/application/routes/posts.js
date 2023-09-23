var express = require("express");
var router = express.Router();
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
var multer = require("multer");
var crypto = require("crypto");
var PostError = require("../helpers/error/PostError");
var PostModel = require("../models/Posts");
const db = require("../config/db");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    let RandomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${RandomName}.${fileExt}`);
  },
});

var uploader = multer({ storage: storage });

router.post("/createPost", uploader.single("chooseImage"), (req, res, next) => {
  let title = req.body.title;
  let description = req.body.description;
  let fk_userId = req.session.userId;
 
    return PostModel.create(
        title,
        description,
        fk_userId
      )
    .then((postWasCreated) => {
      if (postWasCreated) {
        successPrint("if true");
        req.flash("success", "Your post was created successfully!");
        res.redirect("/savedjournals");
      } else {
        resp.json({
          status: "OK",
          message: "post was not created",
          redirect: "/createjournal",
        });
      }
    })
    .catch((err) => {
      if (err instanceof PostError) {
        errorPrint(err.getMessage());
        req.flash("error", err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});

router.get('/savedjournals', (req, res, next) => {
  let searchTerm = req.query.search;
  if (!searchTerm) {
    res.send({
      resultsStatus: "info",
      message: "No search term given",
      results: []
    });
  } else {
    let baseSQL = "SELECT *, concat_ws(' ', title, created) AS haystack \
    FROM zenful_db.journals \
    HAVING haystack LIKE ?;"
    let sqlReadySearchTerm = "%"+searchTerm+"%";
    db.execute(baseSQL, [sqlReadySearchTerm])
    .then(([results, fields]) => {
      if(results && results.length) {
        res.send({
          resultsStatus: "info",
          message: `${results.lenth} results found`,
          results: results
        })
      } else {
        db.query('SELECT id, title, description, created from journals ORDER BY created LIMIT 8;',[])
        .then(([results, fields]) => {
          res.send({
            resultsStatus: "info",
            message: "No results were found for your search, but here are your 8 most recent journals",
            results: results
          })
        })
      }
    })
  }
});

module.exports = router;
