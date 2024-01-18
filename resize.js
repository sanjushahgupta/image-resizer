const sharp = require("sharp");
const fs = require("fs");
const fromS3 = require("./S3");

module.exports = async function resize(objectKey, format, width, destination) {
  const fileDetails = await fromS3.getObjectFromS3(objectKey);
  let transform = sharp(fileDetails.Content);
  transform = transform.toFormat(format);
  transform = transform.resize(width);
  await transform.toFile(destination);

  console.log("Image resized successfully.");
};
