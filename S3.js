const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3Client = new S3Client({
  region: "eu-central-1",
  forcePathStyle: true,
});
const myImageBucket = "image-bucket-535";
const listObjectsParams = {
  Bucket: myImageBucket,
};

//list all objects of s3 bucket
async function listObjectsFromS3() {
  const response = await s3Client.send(
    new ListObjectsV2Command(listObjectsParams)
  );
  const files = [];
  response.Contents.forEach((item) => {
    files.push(item.Key);
  });

  return files;
}

//get specific image from S3
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
    console.error("Error fetching image from S3:", error);
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

//to post image to S3
async function UploadToS3(file, imageToBeResize = "") {
  let putObjectParams;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (file.name) {
    const fileContent = fs.readFileSync(file.tempFilePath);
    putObjectParams = {
      Bucket: myImageBucket,
      Key: file.name,
      Body: fileContent,
    };
  } else {
    const fileName = "thumbnail_" + imageToBeResize;
    putObjectParams = {
      Bucket: myImageBucket,
      Key: fileName,
      Body: file,
    };
  }

  try {
    const putObjectCmd = new PutObjectCommand(putObjectParams);
    await s3Client.send(putObjectCmd);
    return;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
}

module.exports = {
  listObjectsFromS3,
  getObjectFromS3,
  UploadToS3,
};
