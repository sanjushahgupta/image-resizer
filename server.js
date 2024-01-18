const express = require("express");
const server = express();
const resize = require("./resize");
const FromS3 = require("./S3");
const fileUpload = require("express-fileupload");
server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

server.get("/", (req, res) => {
  res.send("Welcome to Image Resizer");
});

//To fetch images directly to S3
server.get("/images", async (req, res) => {
  const objects = await FromS3.listObjectsFromS3();
  res.send(objects);
});

//To fetch image directly to S3 by providing query parameter key
server.get("/image", async (req, res) => {
  try {
    const objectKey = req.query.key;
    const fileDetails = await FromS3.getObjectFromS3(objectKey);

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

//To resize image
server.get("/resize", async (req, res) => {
  try {
    const objectKey = "cover.png";
    await resize(objectKey, "png", 100, "background_small.png");
    res.send("Your image has been resized.");
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).send("Error resizing image.");
  }
});

//To post image to S3
server.post("/image", async (req, res) => {
  try {
    const file = req.files.image;
    await FromS3.UploadToS3(file);
    res.send("Image uploaded");
  } catch (error) {
    res.status(500).send("Error uploading image.");
  }
});

server.listen(3000, () => {
  console.log("Server started");
});
