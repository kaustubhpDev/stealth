const bcrypt = require("bcrypt");
const client = require("../config/dbConfig");
var jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
  });
  const user = {
    firstname,
    lastname,
    username,
    password: hash,
    email,
  };
  var flag = 1;

  client.query(
    `insert into users (firstname,lastname,username,password,email) values($1,$2,$3,$4,$5);`,
    [user.firstname, user.lastname, user.username, user.password, user.email],
    (err) => {
      if (err) {
        flag = 0;
        console.log(err);
        res.status(500).send({ message: "Database Error" });
        return;
      } else {
        flag = 1;
        res.status(200).send({ message: "Yayy , you are registered" });
      }
    }
  );
};
