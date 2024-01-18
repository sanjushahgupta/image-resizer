const sharp = require("sharp");
const fs = require("fs");

module.exports = function resize(path, format, width, destination) {
  let transform = sharp(path);
  if (format) {
    transform = transform.toFormat(format);
    transform = transform.resize(width);
    transform.toFile(destination);
  }
};
