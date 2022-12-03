const bcrypt = require("bcrypt");
const client = require("../config/dbConfig");
require("dotenv").config();

checkDuplicateEmail = async (req, res, next) => {
  const { firstname, lastname, username, password, email } = req.body;

  try {
    // Run the database query
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]);

    // Check the result of the query
    if (!data || !data.rows) {
      // If there is no data, return an error message
      return res.status(500).send({ message: "Database error" });
    }

    // If the data is available, check if the email is already registered
    const arr = data.rows;
    if (arr.length != 0) {
      return res
        .status(400)
        .send({ message: "Email already registered, Try signing in." });
      return;
    }

    // If the email is not registered, continue with the function
  } catch (err) {
    // Handle any errors that occur
    console.log(err);
    return res.status(500).send({ message: "Database error" });
  }
  next();
};

const verifySignup = {
  checkDuplicateEmail,
};
module.exports = verifySignup;
