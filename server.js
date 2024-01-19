const express = require("express");
const { resize } = require("./resizer.js");

const server = express();

server.get("/resize", async (req, res) => {
  const imageToResize = req.query.image;

  try {
    resize(imageToResize);
  } catch (e) {
    if (e.Code == "NoSuchKey") {
      res.send("File does not exist");
      return;
    }

    res.send(e.message);
    return;
  }

  res.send("Done");
});

server.listen(3000, () => {
  console.log("Server started");
});
