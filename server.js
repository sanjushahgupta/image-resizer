const express = require("express");
const server = express();
const resize = require("./resize");
const FromS3 = require("./S3");

server.get("/", (req, res) => {
  res.send("Welcome to Image Resizer");
});

server.get("/resize", async (req, res) => {
  try {
    const objectKey = "cover.png";
    const fileBuffer = await FromS3.getObjectFromS3(objectKey);
    await resize(fileBuffer, "png", 100, "background_small.png");
    res.send("Your image has been resized.");
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).send("Error resizing image.");
  }
});

server.get("/images", async (req, res) => {
  const objects = await FromS3.listObjectsFromS3();
  res.send(objects);
});

server.get("/image", async (req, res) => {
  try {
    const objectKey = req.query.key;
    const fileDetails = await FromS3.getObjectFromS3("cover.png");

    if (!Buffer.isBuffer(fileDetails.Content)) {
      console.error("Error: Content is not a Buffer");
      return res.status(500).send("Error fetching or sending image.");
    }

    res.setHeader("Content-Type", fileDetails.ContentType);
    res.end(fileDetails.Content);
  } catch (error) {
    console.error("Error fetching or sending image:", error);
    res.status(500).send("Error fetching or sending image.");
  }
});

server.listen(3000, () => {
  console.log("Server started");
});
