const client = require("../../config/dbConfig");

exports.saveBadges = async (req, res) => {
  try {
    const userId = req.body.userId;
    const badgeList = req.body.badgeList;
    const assignedDate = new Date(); // Get current date

    // Insert the new row into the badges table
    const insertQuery = `
      INSERT INTO badges (user_id, badge_list, assigned_date)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const badgesResult = await client.query(insertQuery, [
      userId,
      badgeList,
      assignedDate,
    ]);

    // Update the reviewed field in assignment_submission table for the corresponding assignment submission ID
    const submissionId = req.body.submissionId; // Assuming the submissionId is provided in the request body
    const updateQuery = `
      UPDATE assignment_submission
      SET reviewed = true
      WHERE submission_id = $1`;
    await client.query(updateQuery, [submissionId]);

    res.json({
      message: "Badges saved successfully",
      data: badgesResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving badges" });
  }
};
