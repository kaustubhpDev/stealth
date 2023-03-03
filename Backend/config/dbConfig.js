const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "35.193.144.109",
  database: "book.gift",
  password: "postgres",
  port: 5432,
});

module.exports = client;
