const express = require("express");
const server = express();
const resize = require("./resize");

server.get("/", (req, res) => {
  res.send("Welcome to Image Resizer");
});

server.get("/resize", (req, res) => {
  resize("background.png", "png", 100, "bacground_small.png");
  res.send("Your image has been resized.");
});

server.listen(3000, () => {
  console.log("Server started");
});
