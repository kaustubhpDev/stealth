const client = require("../../config/dbConfig");

exports.saveSkills = async (req, res) => {
  const { skill, role, willing_role, user_id } = req.body;

  try {
    const query = `
      INSERT INTO skills (skill, role, willing_role, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [skill, role, willing_role, user_id];

    const result = await client.query(query, values);
    const savedSkill = result.rows[0];

    res.status(201).json({
      message: "Skill saved successfully",
      skill: savedSkill,
    });
  } catch (error) {
    console.error("Error saving skill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveExperience = async (req, res) => {
  const {
    company_name,
    job_title,
    start_date,
    end_date,
    job_description,
    user_id,
  } = req.body;

  try {
    const query = `
      INSERT INTO experience (company_name, job_title, start_date, end_date, job_description, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      company_name,
      job_title,
      start_date,
      end_date,
      job_description,
      user_id,
    ];

    const result = await client.query(query, values);
    const savedExperience = result.rows[0];

    res.status(201).json({
      message: "Experience saved successfully",
      experience: savedExperience,
    });
  } catch (error) {
    console.error("Error saving experience:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveEducation = async (req, res) => {
  const { degree_name, college_name, start_date, end_date, user_id } = req.body;

  try {
    const query = `
        INSERT INTO education (degree_name, college_name, start_date, end_date, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
    const values = [degree_name, college_name, start_date, end_date, user_id];

    const result = await client.query(query, values);
    const savedEducation = result.rows[0];

    res.status(201).json({
      message: "Education saved successfully",
      education: savedEducation,
    });
  } catch (error) {
    console.error("Error saving education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.savePreferences = async (req, res) => {
  const {
    job_seeking,
    job_type,
    job_location,
    company_size,
    desired_salary,
    user_id,
  } = req.body;

  try {
    const query = `
        INSERT INTO preferences (job_seeking, job_type, job_location, company_size, desired_salary, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
    const values = [
      job_seeking,
      job_type,
      job_location,
      company_size,
      desired_salary,
      user_id,
    ];

    const result = await client.query(query, values);
    const savedPreferences = result.rows[0];

    res.status(201).json({
      message: "Preferences saved successfully",
      preferences: savedPreferences,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveUserDescription = async (req, res) => {
  const { description, github, linkedin, portfolio, userId } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO user_description (description, github, linkedin, portfolio, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [description, github, linkedin, portfolio, userId]
    );

    res.status(200).json({
      message: "User description saved successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving user description" });
  }
};
exports.getUsersWithDetails = async (req, res) => {
  try {
    // Fetch the list of users
    const usersQuery = `
      SELECT *
      FROM users`;
    const usersResult = await client.query(usersQuery);
    const users = usersResult.rows;

    // Fetch the latest entry from each related table for each user
    const userDetails = await Promise.all(
      users.map(async (user) => {
        const userId = user.id;

        const skillsQuery = `
          SELECT *
          FROM skills
          WHERE user_id = $1
          ORDER BY id DESC
          LIMIT 1`;
        const skillsResult = await client.query(skillsQuery, [userId]);
        const skills =
          skillsResult.rows.length > 0 ? skillsResult.rows[0] : null;

        const educationQuery = `
          SELECT *
          FROM education
          WHERE user_id = $1
          ORDER BY id DESC
          LIMIT 1`;
        const educationResult = await client.query(educationQuery, [userId]);
        const education =
          educationResult.rows.length > 0 ? educationResult.rows[0] : null;

        const experienceQuery = `
          SELECT *
          FROM experience
          WHERE user_id = $1
          ORDER BY id DESC
          LIMIT 1`;
        const experienceResult = await client.query(experienceQuery, [userId]);
        const experience =
          experienceResult.rows.length > 0 ? experienceResult.rows[0] : null;

        const preferencesQuery = `
          SELECT *
          FROM preferences
          WHERE user_id = $1
          ORDER BY id DESC
          LIMIT 1`;
        const preferencesResult = await client.query(preferencesQuery, [
          userId,
        ]);
        const preferences =
          preferencesResult.rows.length > 0 ? preferencesResult.rows[0] : null;

        const badgesQuery = `
          SELECT *
          FROM badges
          WHERE user_id = $1
          ORDER BY id DESC
          LIMIT 1`;
        const badgesResult = await client.query(badgesQuery, [userId]);
        const badges =
          badgesResult.rows.length > 0 ? badgesResult.rows[0] : null;

        const userDetails = {
          ...user,
          skill: skills ? skills.skill : null,
          role: skills ? skills.role : null,
          willing_role: skills ? skills.willing_role : null,
          degree_name: education ? education.degree_name : null,
          college_name: education ? education.college_name : null,
          start_date: education ? education.start_date : null,
          end_date: education ? education.end_date : null,
          company_name: experience ? experience.company_name : null,
          job_title: experience ? experience.job_title : null,
          job_description: experience ? experience.job_description : null,
          job_seeking: preferences ? preferences.job_seeking : null,
          job_type: preferences ? preferences.job_type : null,
          job_location: preferences ? preferences.job_location : null,
          company_size: preferences ? preferences.company_size : null,
          desired_salary: preferences ? preferences.desired_salary : null,
          badge_list: badges ? badges.badge_list : null,
          assigned_date: badges ? badges.assigned_date : null,
        };

        return userDetails;
      })
    );

    res.json({
      message: "Users details fetched successfully",
      data: userDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users details" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming the user ID is provided as a URL parameter

    // Fetch the user details for the specified user ID
    const userQuery = `
      SELECT *
      FROM users
      WHERE id = $1`;
    const userResult = await client.query(userQuery, [userId]);
    const user = userResult.rows[0]; // Assuming there will be only one matching user

    // Fetch the latest entry from each related table for the retrieved user ID
    const skillsQuery = `
      SELECT *
      FROM skills
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1`;
    const skillsResult = await client.query(skillsQuery, [userId]);
    const skills = skillsResult.rows.length > 0 ? skillsResult.rows[0] : null;

    const educationQuery = `
      SELECT *
      FROM education
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1`;
    const educationResult = await client.query(educationQuery, [userId]);
    const education =
      educationResult.rows.length > 0 ? educationResult.rows[0] : null;

    const experienceQuery = `
      SELECT *
      FROM experience
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1`;
    const experienceResult = await client.query(experienceQuery, [userId]);
    const experience =
      experienceResult.rows.length > 0 ? experienceResult.rows[0] : null;

    const preferencesQuery = `
      SELECT *
      FROM preferences
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1`;
    const preferencesResult = await client.query(preferencesQuery, [userId]);
    const preferences =
      preferencesResult.rows.length > 0 ? preferencesResult.rows[0] : null;

    const badgesQuery = `
      SELECT *
      FROM badges
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1`;
    const badgesResult = await client.query(badgesQuery, [userId]);
    const badges = badgesResult.rows.length > 0 ? badgesResult.rows[0] : null;

    const userDetails = {
      ...user,
      skill: skills ? skills.skill : null,
      role: skills ? skills.role : null,
      willing_role: skills ? skills.willing_role : null,
      degree_name: education ? education.degree_name : null,
      college_name: education ? education.college_name : null,
      start_date: education ? education.start_date : null,
      end_date: education ? education.end_date : null,
      company_name: experience ? experience.company_name : null,
      job_title: experience ? experience.job_title : null,
      job_description: experience ? experience.job_description : null,
      job_seeking: preferences ? preferences.job_seeking : null,
      job_type: preferences ? preferences.job_type : null,
      job_location: preferences ? preferences.job_location : null,
      company_size: preferences ? preferences.company_size : null,
      desired_salary: preferences ? preferences.desired_salary : null,
      badge_list: badges ? badges.badge_list : null,
      assigned_date: badges ? badges.assigned_date : null,
    };

    res.json({
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details" });
  }
};
