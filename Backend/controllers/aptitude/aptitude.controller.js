const client = require("../../config/dbConfig");

exports.saveAptitudeResult = async (req, res) => {
  const { email, completed, score } = req.body;
  try {
    //get the user id for given email address
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    const userId = userResult.rows[0].id;
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    const query = `INSERT INTO aptitudetests (user_id,test_date,expiration_date,score,completed) VALUES ($1,NOW(),$2,$3,$4)`;
    const values = [userId, expirationDate, score, completed];
    const result = await client.query(query, values);
    res
      .status(200)
      .json({ message: "aptitude test result saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "result not submitted" });
  }
};
