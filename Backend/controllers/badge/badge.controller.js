const client = require("../../config/dbConfig");

exports.saveBadges = async (req, res) => {
  try {
    const userId = req.body.userId;
    const badgeList = req.body.badgeList;
    const assignedDate = new Date(); // Get current date

    // Insert the new row into the table
    const query = `
        INSERT INTO badges (user_id, badge_list, assigned_date)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const result = await client.query(query, [userId, badgeList, assignedDate]);

    // Return the inserted row to the client
    res.json({ message: "Badges saved successfully", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving badges" });
  }
};
