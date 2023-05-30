const client = require("../../config/dbConfig");
exports.createJob = async (req, res) => {
  try {
    const {
      hr_id,
      title,
      date,
      budget,
      skills,
      job_description,
      job_responsibilities,
      job_perks,
      experience,
    } = req.body;

    const query = `
      INSERT INTO jobs (hr_id, title, date, budget, skills, job_description, job_responsibilities, job_perks,experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
      RETURNING *
    `;

    const values = [
      hr_id,
      title,
      date,
      budget,
      skills,
      job_description,
      job_responsibilities,
      job_perks,
      experience,
    ];

    const result = await client.query(query, values);
    const job = result.rows[0];

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveInterviewedCandidate = async (req, res) => {
  try {
    const {
      user_id,
      hr_id,
      job_id,
      interview_date,
      interview_round,
      interview_result,
    } = req.body;

    // Insert the interviewed candidate into the database
    const query = `
        INSERT INTO interviewed_candidates (user_id, hr_id, job_id, interview_date, interview_round, interview_result)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
    const values = [
      user_id,
      hr_id,
      job_id,
      interview_date,
      interview_round,
      interview_result,
    ];
    const result = await client.query(query, values);

    const savedInterviewedCandidate = result.rows[0];

    res.status(201).json({
      message: "Interviewed candidate saved successfully",
      interviewedCandidate: savedInterviewedCandidate,
    });
  } catch (error) {
    console.error("Error saving interviewed candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.saveShortlistedCandidate = async (req, res) => {
  try {
    const { user_id, hr_id, job_id, shortlist_date, shortlist_reason } =
      req.body;

    // Insert the shortlisted candidate into the database
    const query = `
        INSERT INTO shortlisted_candidates (user_id, hr_id, job_id, shortlist_date, shortlist_reason)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
    const values = [user_id, hr_id, job_id, shortlist_date, shortlist_reason];
    const result = await client.query(query, values);

    const savedShortlistedCandidate = result.rows[0];

    res.status(201).json({
      message: "Shortlisted candidate saved successfully",
      shortlistedCandidate: savedShortlistedCandidate,
    });
  } catch (error) {
    console.error("Error saving shortlisted candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
