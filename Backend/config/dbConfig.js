const { Client } = require("pg");

const connectionString =
  "postgres://kaustubh:UgO8XLod8g3MGm4vkya9Z0zU8lmfOrXb@dpg-ch5506ss3fvqdilhi39g-a.oregon-postgres.render.com/uplevel";

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
