const bcrypt = require("bcrypt");
const client = require("../config/dbConfig");
require("dotenv").config();

checkDuplicateEmail = (req, res, next) => {
  const { firstname, lastname, username, password, email } = req.body;
  try {
    const data = client.query(`SELECT * FROM users WHERE email= $1;`, [email]);
    const arr = data.rows;
    if (arr.length != 0) {
      return res
        .status(400)
        .send({ message: "Email already registered, Try signing in." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Database error" });
  }
  next();
};

const verifySignup = {
  checkDuplicateEmail,
};
modulele.exports = verifySignup;
