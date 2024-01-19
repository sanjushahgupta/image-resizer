const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "eu-central-1",
  forcePathStyle: true,
});
const myImageBucket = "image-bucket-535";

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

async function resizeImage(imageBuffer) {
  let transform = sharp(imageBuffer);
  transform = transform.resize({
    width: 150,
  });

  return await transform.toBuffer();
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

async function resize(name) {
  imageBuffer = await getObjectFromS3(name);
  const resizedBuffer = await resizeImage(imageBuffer);
  const resizedImageName = "thumbnail_" + name;
  await uploadToS3(resizedBuffer, resizedImageName);
}

module.exports = {
  resize,
};
