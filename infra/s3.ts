import * as aws from '@pulumi/aws';

export const bucket = new aws.s3.Bucket("bsdac-rap-audio");

new aws.s3.BucketPolicy("bsdac-rap-audio-policy", {
  bucket: bucket.bucket,
  policy: bucket.bucket.apply((bucketName) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
          Effect: "Allow",
          Principal: "*",
          Action: [ "s3:GetObject", "s3:PutObject" ],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
      }]
    }))
});