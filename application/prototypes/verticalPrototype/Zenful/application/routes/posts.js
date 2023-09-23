var express = require("express");
var router = express.Router();
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
var multer = require("multer");
var crypto = require("crypto");
var PostError = require("../helpers/error/PostError");
var PostModel = require("../models/Posts");

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
        res.redirect("/");
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

module.exports = router;
