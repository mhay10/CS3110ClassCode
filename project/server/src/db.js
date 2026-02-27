const Datastore = require("nedb");

const db = new Datastore({ filename: "../project.db", autoload: true });

module.exports = {
  db: db,
};
