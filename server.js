const express = require("express");
const { getObjectFromS3, resizeImage, uploadToS3 } = require("./resizer.js");

const server = express();

server.get("/resize", async (req, res) => {
  const imageToResize = req.query.image;
  let imageBuffer;

  try {
    imageBuffer = await getObjectFromS3(imageToResize);
  } catch (e) {
    if (e.Code == "NoSuchKey") {
      res.send("File does not exist");
      return;
    }

    res.send(e.message);
    return;
  }

  const resizedBuffer = await resizeImage(imageBuffer);
  const resizedImageName = "thumbnail_" + imageToResize;

  try {
    await uploadToS3(resizedBuffer, resizedImageName);
    res.send("Done");
  } catch (error) {
    res.send(error);
  }
});

server.listen(3000, () => {
  console.log("Server started");
});
