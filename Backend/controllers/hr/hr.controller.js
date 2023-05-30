const client = require("../../config/dbConfig");
exports.createJob = async (req, res) => {
  try {
    const {
      hr_id,
      jobTitle,
      date,
      budget,
      skills,
      jobDescription,
      jobRoles,
      jobPerks,
      experience,
    } = req.body;

    const query = `
      INSERT INTO jobs (hr_id, title, date, budget, skills, job_description, job_responsibilities, job_perks,experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
      RETURNING *
    `;

    const values = [
      hr_id,
      jobTitle,
      date,
      budget,
      skills,
      jobDescription,
      jobRoles,
      jobPerks,
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
    const { user_id, hr_id, job_id, shortlist_date } = req.body;

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
exports.getAllJobs = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM jobs");
    const jobs = result.rows;
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};
exports.filterCandidates = async (req, res) => {
  try {
    const { skills, experience } = req.body;

    const formattedSkills = skills.map((badge) => badge.toLowerCase()); // or .toUpperCase() if needed

    const query = `
      SELECT *
      FROM badges
      WHERE exists (
        SELECT 1
        FROM unnest(badge_list) badge
        WHERE lower(badge) = any($1) -- or upper(badge) = any($1) if needed
      )`;
    const skillResult = await client.query(query, [formattedSkills]);

    const userIds = skillResult.rows.map((badge) => badge.user_id);

    const experienceQuery = `
      SELECT *
      FROM experience
      WHERE years_of_experience >= $1
        AND user_id = ANY($2)`;
    const experienceResult = await client.query(experienceQuery, [
      experience,
      userIds,
    ]);

    const filteredCandidates = experienceResult.rows;

    res.json({
      message: "Filtered candidates fetched successfully",
      data: filteredCandidates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching filtered candidates" });
  }
};

exports.getShortlistedJobs = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the job IDs for which the student has been shortlisted
    const query = `
      SELECT job_id
      FROM shortlisted_candidates
      WHERE user_id = $1`;
    const result = await client.query(query, [userId]);
    const jobIds = result.rows.map((row) => row.job_id);

    // Fetch the job details for the shortlisted jobs
    const jobsQuery = `
      SELECT *
      FROM jobs
      WHERE id = ANY($1)`;
    const jobsResult = await client.query(jobsQuery, [jobIds]);
    const shortlistedJobs = jobsResult.rows;

    res.json({
      message: "Shortlisted jobs fetched successfully",
      data: shortlistedJobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shortlisted jobs" });
  }
};
