const { Pool } = require("pg");
const client = require("../../config/dbConfig");

exports.test = async (req, res) => {
  const domain_name = req.query.domain_name;
  const level = req.query.level;

  let query = `select questions.text , code_snippets.code , domains.domain_name
  from questions q
  inner join code_snippets c on q.id = c.question_id
  inner join domains d on q.domain_id = d.id
  `;
  let values = [];

  if (domain && difficulty) {
    //if both parameters are provided , filter the results by both domain and difficulty.
    query += `where d.name=$1 and q.difficulty =$2`;
    values = [domain, difficulty];
  } else if (domain) {
    // if only the domain parameters are provided filter the results by domain only
    query += `where d.name = $1 `;
    values = [domain];
  } else if (difficulty) {
    query += `where q.difficulty = $1`;
    values = [difficulty];
  }
  // add the sorting condition to the query
  query += `order by d.name asc,q.text desc`;

  Pool.query(query, values, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).send({ message: result.rows });
    }
  });
};
