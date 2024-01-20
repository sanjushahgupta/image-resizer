const { resize } = require("./resizer.js");

exports.handler = async function handler(event) {
  const imageToResize = event.Records[0].s3.object.key;
  try {
    await resize(imageToResize);
  } catch (e) {
    if (e.Code == "NoSuchKey") {
      return "File does not exist";
    }

    return e.message;
  }
  return "Done";
};
