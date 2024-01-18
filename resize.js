const sharp = require("sharp");
const fs = require("fs");
const fromS3 = require("./S3");

module.exports = async function resize(path, format, width, destination) {
  const file = await fromS3.getObjectFromS3(path);
  let transform = sharp(file);

  transform = transform.toFormat(format);
  transform = transform.resize(width);
  await transform.toFile(destination);

  //saveFileToS3();
};
