const client = require("../../config/dbConfig");

exports.getAllQuestions = async (req, res) => {
  try {
    // Fetch all the questions from the database
    const query = "SELECT * FROM questions";
    const result = await client.query(query);

    // Return the questions to the client
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving questions" });
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
