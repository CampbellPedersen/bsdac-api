import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface GithubDeployRoleArgs {
  backendRepositoryArn: pulumi.Input<string>;
  ec2InstanceArn: pulumi.Input<string>;
  frontendRepositoryArn: pulumi.Input<string>;
  owner: string;
  repo: string;
}

const githubOidcThumbprints = [
  "6938fd4d98bab03faadb97b34396831e3780aea1",
];

export const createGithubDeployRole = (name: string, args: GithubDeployRoleArgs) => {
  const callerIdentity = aws.getCallerIdentityOutput({});
  const region = aws.getRegionOutput();
  const githubOidcProvider = new aws.iam.OpenIdConnectProvider(`${name}-oidc`, {
    clientIdLists: ["sts.amazonaws.com"],
    thumbprintLists: githubOidcThumbprints,
    url: "https://token.actions.githubusercontent.com",
  });

  const role = new aws.iam.Role(`${name}-role`, {
    assumeRolePolicy: pulumi
      .all([callerIdentity.accountId, githubOidcProvider.arn])
      .apply(([, providerArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "sts:AssumeRoleWithWebIdentity",
              Principal: {
                Federated: providerArn,
              },
              Condition: {
                StringEquals: {
                  "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                },
                StringLike: {
                  "token.actions.githubusercontent.com:sub": `repo:${args.owner}/${args.repo}:*`,
                },
              },
            },
          ],
        }),
      ),
  });

  new aws.iam.RolePolicy(`${name}-policy`, {
    role: role.id,
    policy: pulumi
      .all([
        args.frontendRepositoryArn,
        args.backendRepositoryArn,
        args.ec2InstanceArn,
        callerIdentity.accountId,
        region.name,
      ])
      .apply(([frontendRepositoryArn, backendRepositoryArn, ec2InstanceArn, accountId, regionName]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["ecr:GetAuthorizationToken"],
              Resource: "*",
            },
            {
              Effect: "Allow",
              Action: [
                "ecr:BatchCheckLayerAvailability",
                "ecr:BatchGetImage",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeImages",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
              ],
              Resource: [frontendRepositoryArn, backendRepositoryArn],
            },
            {
              Effect: "Allow",
              Action: ["ssm:SendCommand"],
              Resource: [
                `arn:aws:ssm:${regionName}::document/AWS-RunShellScript`,
                ec2InstanceArn,
              ],
            },
            {
              Effect: "Allow",
              Action: ["ssm:GetCommandInvocation"],
              Resource: "*",
            },
          ],
        }),
      ),
  });

  return {
    githubOidcProvider,
    role,
  };
};
