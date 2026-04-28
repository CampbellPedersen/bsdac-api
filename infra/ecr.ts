import * as aws from "@pulumi/aws";

export const frontendRepository = new aws.ecr.Repository("bsdac-frontend", {
  forceDelete: false,
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "IMMUTABLE",
  name: "bsdac-frontend",
});

export const backendRepository = new aws.ecr.Repository("bsdac-backend", {
  forceDelete: false,
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "IMMUTABLE",
  name: "bsdac-backend",
});
