const express = require("express");
const fileUpload = require("express-fileupload");

const { resizeImage } = require("./resize");
const s3Bucket = require("./S3");
const server = express();

server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

server.get("/", (res) => {
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
    const imageBuffer = await s3Bucket.getObjectFromS3(objectKey);

    if (!Buffer.isBuffer(imageBuffer)) {
      return res.status(500).send("image buffer: error");
    }
    res.setHeader("Content-Type", "image/png");
    res.end(imageBuffer);
  } catch (error) {
    res.status(500).send("Error");
  }
});

//To resize image
server.get("/resize", async (req, res) => {
  const imageToResize = req.query.image;
  let imageBuffer;
  try {
    imageBuffer = await s3Bucket.getObjectFromS3(imageToResize);
  } catch (e) {
    if (e.Code == "NoSuchKey") {
      res.send("That file does not exist.");
      return;
    }

    res.send(e.message);
    return;
  }

  const resizedBuffer = await resizeImage(imageBuffer);

  try {
    await s3Bucket.UploadToS3(resizedBuffer, imageToResize);
    res.send("Fetched, resized and uploaded to S3.");
  } catch (error) {
    res.send(error);
  }
});

//To post image to S3
server.post("/image", async (req, res) => {
  try {
    const file = req.files.image;
    await s3Bucket.UploadToS3(file);
    res.send("Image uploaded");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading image.");
  }
});

server.listen(3000, () => {
  console.log("Server started");
});
