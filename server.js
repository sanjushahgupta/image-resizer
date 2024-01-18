const express = require("express");
const server = express();
const resize = require("./resize");
const listObjectsFromS3 = require("./S3");

server.get("/", (req, res) => {
  res.send("Welcome to Image Resizer");
});

server.get("/resize", (req, res) => {
  resize("background.png", "png", 100, "background_small.png");
  res.send("Your image has been resized.");
});

server.get("/images", async (req, res) => {
  const objects = await listObjectsFromS3();
  res.send(objects);
});

server.listen(3000, () => {
  console.log("Server started");
});
