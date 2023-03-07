const client = require("../../config/dbConfig");

exports.getQuestions = async (req, res) => {
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

  try {
    const result = await client.query(query, values);
    res.status(200).send({ message: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestions = async (req, res) => {
  try {
    // Extract the data from the request body
    const { questionLevel, questionValue, domainName } = req.body;

    // Look up the domain ID corresponding to the provided domain name
    const result = await client.query(
      "SELECT domain_id FROM domains WHERE domain_name = $1",
      [domainName]
    );
    const domainId = result.rows[0].domain_id;

    // Insert the new row into the table
    const newresult = await client.query(
      "INSERT INTO questions (question_level, question_value, domain_id) VALUES ($1, $2, $3) RETURNING *",
      [questionLevel, questionValue, domainId]
    );

    // Return the inserted row to the client
    res.json(newresult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inserting new question" });
  }
};

async function addQuestion(req, res) {
  // Implementation of addQuestion function
}
