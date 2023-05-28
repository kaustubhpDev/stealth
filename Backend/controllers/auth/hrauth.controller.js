const bcrypt = require("bcrypt");
const client = require("../../config/dbConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../../config/authConfig");

exports.signup = async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // Hash the password with bcrypt
  const hash = await bcrypt.hash(password, 10);

  const user = {
    firstname,
    lastname,
    username,
    password: hash,
    email,
  };

  try {
    await client.query(
      `insert into users (firstname,lastname,username,password,email) values($1,$2,$3,$4,$5);`,
      [user.firstname, user.lastname, user.username, user.password, user.email]
    );
    res.status(200).send({ message: "Yayy , you are registered" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Database Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const result = await client.query(`select * from users where email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    const user = result.rows[0];
    const firstname = user.firstname;
    const lastname = user.lastname;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { userId: user.id, firstName: user.firstname, lastName: user.lastname },
      config.secret
    );
    return res.status(200).send({ token, firstname, lastname });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Database Error" });
  }
};
