const client = require("../../config/dbConfig");
const uploadfile = require("./uploadfile");

exports.savetakehomeassignment = async (req, res) => {
  try {
    const { name, domain, level, base64 } = req.body;
    const url = await uploadfile(base64);
    if (!url) {
      console.log("failed");
      return res.status(400).send({ error: "file upload failed" });
    }
    const newAssignment = await client.query(
      "INSERT INTO assignment (assignment_name,assignment_domain,assignment_level,assignment_url) VALUES ($1, $2, $3,$4) RETURNING *",
      [name, domain, level, url]
    );
    res.status(200).send({ message: "assignment uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "failed to upload" });
  }
};

exports.submittakehomeassignment = async (req, res) => {
  try {
    const { student_id, assignment_id, submission_url } = req.body;
    const insertQuery =
      "INSERT INTO assignment_submission (user_id, assignment_id, submission_url) VALUES ($1, $2, $3) RETURNING submission_id";
    const values = [student_id, assignment_id, submission_url];
    const queryResult = await client.query(insertQuery, values);
    const newSubmissionId = queryResult.rows[0].submission_id;
    res.status(201).json({
      message: "Assignment submitted successfully",
      submissionId: newSubmissionId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving assignment submission" });
  }
};
