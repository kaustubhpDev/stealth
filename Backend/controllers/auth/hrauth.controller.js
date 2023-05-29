const bcrypt = require("bcrypt");
const client = require("../../config/dbConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../../config/authConfig");

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  // Hash the password with bcrypt
  const hash = await bcrypt.hash(password, 10);

  try {
    await client.query(
      `INSERT INTO hr (email, password, role) VALUES ($1, $2, $3);`,
      [email, hash, role]
    );
    res.status(200).send({ message: "You are registered successfully" });
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
    const result = await client.query(`SELECT * FROM hr WHERE email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    const hr = result.rows[0];
    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }
    const token = jwt.sign({ hrId: hr.id, email: hr.email }, process.env.JWT_SECRET);
    return res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Database Error" });
  }
};
exports.verifyhr = async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  try {
    const decodedToken = jwt.verify(token, config.secret);
    const hrId = decodedToken.hrId;

    const result = await client.query(`SELECT * FROM hr WHERE id = $1`, [hrId]);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: "HR not found" });
    }

    const hr = result.rows[0];
    const hrDetails = {
      username: hr.username,
      email: hr.email,
    };

    res.status(200).send(hrDetails);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Database Error" });
  }
};
