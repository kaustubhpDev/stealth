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

exports.downloadTakeHomeAssignment = async (req, res) => {
  try {
    const { student_id, assignment_id, assignment_started_date } = req.body;

    const insertQuery =
      "INSERT INTO assignment_submission (user_id, assignment_id, assignment_started_date) VALUES ($1, $2, $3) RETURNING submission_id";
    const values = [student_id, assignment_id, assignment_started_date];

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

exports.updateAssignmentSubmission = async (req, res) => {
  try {
    const { student_id, assignment_id, submission_url } = req.body;

    const checkQuery = `
      SELECT assignment_started_date
      FROM assignment_submission
      WHERE user_id = $1 AND assignment_id = $2
      ORDER BY assignment_started_date DESC
      LIMIT 1
    `;
    const checkResult = await client.query(checkQuery, [
      student_id,
      assignment_id,
    ]);

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ message: "Assignment not found" });
    }

    const assignmentStartedDate = checkResult.rows[0].assignment_started_date;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    if (assignmentStartedDate < threeDaysAgo) {
      return res
        .status(400)
        .json({ message: "Assignment submission period expired" });
    }

    const updateQuery = `
      UPDATE assignment_submission
      SET submission_url = $1
      WHERE user_id = $2 AND assignment_id = $3
    `;
    await client.query(updateQuery, [
      submission_url,
      student_id,
      assignment_id,
    ]);

    res
      .status(200)
      .json({ message: "Assignment submission updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating assignment submission" });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM assignment");
    const assignments = result.rows;
    res.status(200).json({ assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};
