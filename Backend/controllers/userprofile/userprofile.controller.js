const client = require("../../config/dbConfig");

exports.saveprofile = async (req, res) => {
  const {
    username,
    user_description,
    address,
    linkedin_profile,
    portfolio,
    city,
    skills,
    job_type,
    work_location,
    company_size,
    email,
  } = req.body;
  try {
    //get the user id for given email address
    const userResult = await client.query(
      "SELECT id FROM users WHERE email= $1",
      [email]
    );
    const userId = userResult.rows[0].id;

    const result = await client.query(
      "INSERT INTO user_profiles (username, user_description, address, linkedin_profile, portfolio, city, skills, job_type, work_location, company_size, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        username,
        user_description,
        address,
        linkedin_profile,
        portfolio,
        city,
        skills,
        job_type,
        work_location,
        company_size,
        userId,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error saving user profile " });
  }
};
