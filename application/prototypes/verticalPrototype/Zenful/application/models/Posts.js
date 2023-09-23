var db = require("../config/db");
const { successPrint } = require("../helpers/debug/debugprinters");

const PostModel = {};

PostModel.create = (title, description, fk_authorId) => {
  let baseSQL =
    "INSERT INTO journals (title, description, created, fk_authorId) VALUE (?,?,now(),?);";
  return db
    .execute(baseSQL, [title, description, fk_authorId])
    .then(([results, fields]) => {
      return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getNRecentPosts = (numberOfPosts) => {
  let baseSQL = `SELECT id, title, description, created FROM journals ORDER BY created DESC LIMIT 16`;
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getJournalById = (journalId) => {
  let baseSQL = `SELECT u.username, j.title, j.description, j.created
  FROM users u
  JOIN journals j
  ON u.id=j.fk_authorId 
  WHERE j.id=?;`;

  return db
    .execute(baseSQL, [journalId])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getJournalsByUserId = (userId) => {
  let baseSQL = "SELECT * FROM journals WHERE fk_authorId = ?;";
  return db
    .execute(baseSQL, [userId])
    .then(([results, fields]) => {
      successPrint('successssss');
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

module.exports = PostModel;
