var express = require("express");
var router = express.Router();
var db = require("../config/db");
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const UserModel = require("../models/Users");
const UserError = require("../helpers/error/UserError");
var bcrypt = require("bcrypt");
const { registerValidator } = require("../middleware/validation");
const { usernameExists, emailExists } = require("../models/Users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.use("/register", registerValidator);
router.post("/register", (req, res, next) => {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  let cpassword = req.body.confirmPassword;
  let email = req.body.email;

  UserModel.usernameExists(username)
    .then((userDoesExists) => {
      if (userDoesExists) {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      } else {
        UserModel.emailExists(email);
      }
    })
    .then((emailDoesExists) => {
      if (emailDoesExists) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new UserError(
          "Server Error, user could not be created",
          "/registration",
          500
        );
      } else {
        successPrint("User.js --> user was created!");
        req.flash("success", "User account has been made!");
        res.redirect("/login");
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash("error", err.getMessage);
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });

});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  // let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
  // let userId;
  // db.execute(baseSQL, [username])
  //   .then(([results, fields]) => {
  //     successPrint(results);
  //     if (results && results.length == 1) {
  //       let hashedPasword = results[0].password;
  //       userId = results[0].id;
  //       return bcrypt.compare(password, hashedPasword);
  //     } else {
  //       throw new UserError("Invalid username and/or password", "/login", 200);
  //     }
  //   })
  UserModel.authenticate(username, password)
    .then((loggedUserId) => {
      if (loggedUserId > 0) {
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserId;
        res.locals.logged = true;
        req.flash("success", "You have been logged in!");
        res.redirect("/");
      } else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash("error", err.getMessage);
        res.status(err.getStatus());
        res.redirect("/login");
      } else {
        next(err);
      }
    });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("session could not be destroyed.");
      next(err);
    } else {
      successPrint("Session was destroyed");
      res.clearCookie("csid");
      res.json({ status: "OK", message: "User is logged out" });
    }
  });
});

module.exports = router;
