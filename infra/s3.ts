import * as aws from '@pulumi/aws';

export const bucket = new aws.s3.Bucket("bsdac-rap-audio", {
  forceDestroy: false,
});

new aws.s3.BucketPublicAccessBlock("bsdac-rap-audio-public-access", {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});
