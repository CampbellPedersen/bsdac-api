import * as aws from "@pulumi/aws";

export const frontendRepository = new aws.ecr.Repository("bsdac-frontend", {
  forceDelete: false,
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "IMMUTABLE",
  name: "bsdac-frontend",
});

new aws.ecr.LifecyclePolicy("bsdac-frontend-lifecycle", {
  policy: JSON.stringify({
    rules: [
      {
        action: {
          type: "expire",
        },
        description: "Keep only the 20 most recent tagged frontend images",
        rulePriority: 1,
        selection: {
          countNumber: 20,
          countType: "imageCountMoreThan",
          tagPatternList: ["*"],
          tagStatus: "tagged",
        },
      },
    ],
  }),
  repository: frontendRepository.name,
});

export const backendRepository = new aws.ecr.Repository("bsdac-backend", {
  forceDelete: false,
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "IMMUTABLE",
  name: "bsdac-backend",
});

new aws.ecr.LifecyclePolicy("bsdac-backend-lifecycle", {
  policy: JSON.stringify({
    rules: [
      {
        action: {
          type: "expire",
        },
        description: "Keep only the 20 most recent tagged backend images",
        rulePriority: 1,
        selection: {
          countNumber: 20,
          countType: "imageCountMoreThan",
          tagPatternList: ["*"],
          tagStatus: "tagged",
        },
      },
    ],
  }),
  repository: backendRepository.name,
});
