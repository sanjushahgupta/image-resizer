const sharp = require("sharp");
const fs = require("fs");
const fromS3 = require("./S3");

const resizeImage = async function (objectKey, format, width) {
  const fileDetails = await fromS3.getObjectFromS3(objectKey);
  let transform = sharp(fileDetails.Content);
  transform = transform.toFormat(format);
  transform = transform.resize(width);
  const resizedImageBuffer = await transform.toBuffer();
  return resizedImageBuffer;
};

module.exports = {
  resizeImage,
};
