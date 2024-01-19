const s3Bucket = require("./S3");

exports.handler = async (event) => {
  // Read data from the event object.
  const region = event.Records[0].awsRegion;
  const sourceBucket = event.Records[0].s3.bucket.name;
  const sourceKey = event.Records[0].s3.object.key;

  try {
    const imageBuffer = await s3Bucket.getObjectFromS3(sourceKey);
    const resizedBuffer = await s3Bucket.resizeImage(imageBuffer);
    await s3Bucket.UploadToS3(resizedBuffer, sourceKey);
    return {
      statusCode: 200,
      body: "Image fetched,resized and uploaded successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
