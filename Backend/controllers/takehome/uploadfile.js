const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dsisgnblg",
  api_key: "874969174348824",
  api_secret: "c09RlkpbnzEFfRJcUr3zeJ-DnX4",
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

module.exports = async (pdf) => {
  try {
    const result = await cloudinary.uploader.upload(pdf, {
      ...opts,
      timeout: 300000,
    });
    console.log(`result - ${result}`);
    console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.log(`Error -${error}`);
    console.log(error);
    throw { message: error.message };
  }
};
