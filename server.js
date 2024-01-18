const express = require("express");
const server = express();
const imageSize = require("image-size");
const { resizeImage } = require("./resize");
const s3Bucket = require("./S3");
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

//To fetch all images from S3
server.get("/images", async (req, res) => {
  const objects = await s3Bucket.listObjectsFromS3();
  res.send(objects);
});

//To fetch image directly from S3 by providing query parameter key
server.get("/image", async (req, res) => {
  try {
    const objectKey = req.query.key;
    const fileDetails = await s3Bucket.getObjectFromS3(objectKey);

    if (!Buffer.isBuffer(fileDetails.Content)) {
      return res.status(500).send("Error");
    }
    res.setHeader("Content-Type", "image/png");
    res.end(fileDetails.Content);
  } catch (error) {
    res.status(500).send("Error");
  }
});

//To resize image
server.get("/resize", async (req, res) => {
  try {
    const objectKey = "cover.png";
    await resizeImage(objectKey, "png", 100);
    res.send("Your image has been resized.");
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("Error");
  }
});

//To post image to S3
server.post("/image", async (req, res) => {
  try {
    const file = req.files.image;
    await s3Bucket.UploadToS3(file);
    await s3Bucket.getObjectFromS3(file.name);
    const resizedImage = await resizeImage(file.name, "png", 100);
    await s3Bucket.UploadToS3(resizedImage);
    const resizedImagewidth = imageSize(resizedImage).width;
    console.log("resized image height", resizedImagewidth);
    res.send("Image uploaded");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading image.");
  }
});

server.listen(3000, () => {
  console.log("Server started");
});
