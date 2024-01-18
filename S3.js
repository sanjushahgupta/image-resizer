const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

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

//get specific image
async function getObjectFromS3(objectKey) {
  const getObjectParams = {
    Bucket: myImageBucket,
    Key: objectKey,
  };
  const response = await s3Client.send(new GetObjectCommand(getObjectParams));
  const responseObject = {
    LastModified: response.LastModified,
    ETag: response.ETag,
    Size: response.ContentLength,
    ContentType: response.ContentType,
  };

  return responseObject;
}

module.exports = {
  listObjectsFromS3,
  getObjectFromS3,
};
