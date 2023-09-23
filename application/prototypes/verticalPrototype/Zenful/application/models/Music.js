var db = require("../config/db");

const MusicModel = {};

MusicModel.create = (title, description, fk_authorId) => {
  let baseSQL =
    "INSERT INTO journals (title, description, created, fk_authorId) VALUE (?,?,now(),?);";
  return db
    .execute(baseSQL, [title, description, fk_authorId])
    .then(([results, fields]) => {
      return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

MusicModel.search = (searchTerm, userId) => {
    // created FROM journals WHERE fk_authorId = ? AND (title LIKE ? OR description LIKE ?);";

  let baseSQL =
    "SELECT id, title, description, concat_ws(' ', title, description) AS haystack \
        FROM journals \
        having haystack like ?;";
  let sqlReadySearchTerm = "%" + searchTerm + "%";
  return db
    .execute(baseSQL, [userId, sqlReadySearchTerm])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

MusicModel.getMusicById = (journalId) => {
  let baseSQL = `SELECT u.username, j.title, j.description, j.created
  FROM users u
  JOIN music m
  ON u.id=j.fk_authorId 
  WHERE j.id=?;`;

  return db
    .execute(baseSQL, [journalId])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

MusicModel.getJournalsByUserId = (userId) => {
  let baseSQL = "SELECT * FROM music WHERE fk_authorId = ? ORDER BY uploaded;";
  return db
    .execute(baseSQL, [userId])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

module.exports = MusicModel;
