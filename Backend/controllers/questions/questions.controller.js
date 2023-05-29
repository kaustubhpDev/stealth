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

exports.addQuestion = async (req, res) => {
  try {
    // Extract the data from the request body
    const { question, level, domain, options, answer } = req.body;

    // Insert the new row into the table
    const newQuestion = await client.query(
      "INSERT INTO questions (question_level, question_value, question_answer,question_options,question_domain) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      [level, question, answer, options, domain]
    );

    // Return the inserted row to the client
    res.json({ message: "saved", data: newQuestion.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inserting new question" });
  }
};
