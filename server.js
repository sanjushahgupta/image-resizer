const express = require("express");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const server = express();
const s3Client = new S3Client({
  region: "eu-central-1",
  forcePathStyle: true,
});
const myImageBucket = "image-bucket-535";

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

async function resizeImage(imageBuffer) {
  let transform = sharp(imageBuffer);
  transform = transform.resize({
    width: 150,
  });

  return await transform.toBuffer();
}

async function getObjectFromS3(objectKey) {
  const getObjectParams = {
    Bucket: myImageBucket,
    Key: objectKey,
  };

  try {
    const response = await s3Client.send(new GetObjectCommand(getObjectParams));
    const Imagebuffer = await streamToBuffer(response.Body);
    return Imagebuffer;
  } catch (error) {
    throw error;
  }
}

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function uploadToS3(file, fileName) {
  let putObjectParams;
  if (!file) {
    throw Error("File not found");
  }

  putObjectParams = {
    Bucket: myImageBucket,
    Key: fileName,
    Body: file,
  };

  try {
    const putObjectCmd = new PutObjectCommand(putObjectParams);
    await s3Client.send(putObjectCmd);
    return;
  } catch (error) {
    throw error;
  }
}

server.listen(3000, () => {
  console.log("Server started");
});
