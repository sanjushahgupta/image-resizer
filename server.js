const express = require("express");
const server = express();
const resize = require("./resize");
const FromS3 = require("./S3");

server.get("/", (req, res) => {
  res.send("Welcome to Image Resizer");
});

server.get("/resize", (req, res) => {
  // resize("background.png", "png", 100, "background_small.png");
  res.send("Your image has been resized.");
});

server.get("/images", async (req, res) => {
  const objects = await FromS3.listObjectsFromS3();
  res.send(objects);
});

server.get("/image", async (req, res) => {
  const objectKey = req.query.key;
  const fileDetails = await FromS3.getObjectFromS3(objectKey);
  res.json(fileDetails);
});

server.listen(3000, () => {
  console.log("Server started");
});
