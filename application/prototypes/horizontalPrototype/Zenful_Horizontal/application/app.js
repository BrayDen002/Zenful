const createError = require("http-errors");
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var flash = require("express-flash");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
var sessions = require("express-session");
const session = require("express-session");
const { post } = require("./routes/users");
var mysqlSession = require("express-mysql-session")(sessions);
var musicRouter = require("./routes/music");
// var searchEng = require('./public/js/frontendjs');

const app = express();

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {
      emptyObject: (obj) => {
        return !(obj && obj.constructor === Object && Object.keys(obj).length == 0);
      },
    }, //adding new helpers to handlebars for extra functionality
  })
);

var mysqlSessionStore = new mysqlSession(
  {
    /* using default options */
  },
  require("./config/db")
);
app.use(
  sessions({
    key: "csid",
    secret: "this is a secret from zenful",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(favicon(__dirname + "/public/favicon.ico"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(req.session);
  if (req.session.username) {
    res.locals.logged = true;
  }
  next();
});

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/journals", postsRouter);
app.use("/music", musicRouter);

/**
 * Catch all route, if we get to here then the
 * resource requested could not be found.
 */
app.use((req, res, next) => {
  next(
    createError(404, `The route ${req.method} : ${req.url} does not exist.`)
  );
});

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
