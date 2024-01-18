const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "eu-central-1",
  //endpoint: "http://localhost:4566",
  forcePathStyle: true,
});
const myImageBucket = "image-bucket-535";
const listObjectsParams = {
  Bucket: myImageBucket,
};

//list all objects of s3 bucket

module.exports = async function listObjectsFromS3() {
  const response = await s3Client.send(
    new ListObjectsV2Command(listObjectsParams)
  );

  const files = [];

  response.Contents.forEach((item) => {
    files.push(item.Key);
  });
  return files;
};
//function saveFileToS3() {}
