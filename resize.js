const sharp = require("sharp");

async function resizeImage(imageToBeResize) {
  let transform = sharp(imageToBeResize);
  transform = transform.resize({
    width: 70,
    height: 70,
    fit: sharp.fit.inside,
  });
  const resizedBuffer = await transform.toBuffer();

  return resizedBuffer;
}

module.exports = {
  resizeImage,
};
