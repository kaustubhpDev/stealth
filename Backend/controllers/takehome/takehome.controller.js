const client = require("../../config/dbConfig");
const uploadfile = require("./uploadfile");

exports.savetakehomeassignment = async (req, res) => {
  try {
    const { file } = req;
    const url = await uploadfile(file.path);
    const insertQuery = "INSERT INTO assignments (url) VALUES ($1) RETURNING *";
    const values = [url];
    const queryResult = await client.query(insertQuery, values);
    res.status(200).send({ message: "assignment uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "failed to upload" });
  }
};
