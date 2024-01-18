const sharp = require("sharp");
const fs = require("fs");

module.exports = function resize(path, format, width, destination) {
  const file = getFileFromS3(path);
  let transform = sharp(file.body);
  if (format) {
    transform = transform.toFormat(format);
    transform = transform.resize(width);
    transform.toFile(destination);
  }
  saveFileToS3();
};
