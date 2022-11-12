//conection with data base

const knex = require('knex')({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "./mydb.sqlite"
    }
});

module.exports = knex