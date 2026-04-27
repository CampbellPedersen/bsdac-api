import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface DockerHostArgs {
  bucketArn: pulumi.Input<string>;
  tableArn: pulumi.Input<string>;
  instanceType?: pulumi.Input<string>;
}

export interface DockerHost {
  elasticIp: aws.ec2.Eip;
  instance: aws.ec2.Instance;
  instanceProfile: aws.iam.InstanceProfile;
  role: aws.iam.Role;
  securityGroup: aws.ec2.SecurityGroup;
}

const userData = `#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker git awscli

compose_arch="$(uname -m)"
case "$compose_arch" in
  x86_64)
    compose_binary="docker-compose-linux-x86_64"
    ;;
  aarch64|arm64)
    compose_binary="docker-compose-linux-aarch64"
    ;;
  *)
    echo "Unsupported architecture for Docker Compose plugin: $compose_arch" >&2
    exit 1
    ;;
esac

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.29.7/\${compose_binary}" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user
id -u ssm-user >/dev/null 2>&1 && usermod -aG docker ssm-user || true

mkdir -p /opt/bsdac
cat >/opt/bsdac/README.txt <<'EOF'
Place the production docker-compose file and environment file for BSDAC here.
Expected location:
  /opt/bsdac/deploy/docker-compose.prod.yml
  /opt/bsdac/deploy/.env

The EC2 instance role already has scoped access to the app S3 bucket and DynamoDB table.
EOF

cat >/usr/local/bin/bsdac-restart <<'EOF'
#!/bin/bash
set -euxo pipefail
cd /opt/bsdac/deploy
docker compose -f docker-compose.prod.yml up -d
EOF

chmod +x /usr/local/bin/bsdac-restart
`;

const amazonLinuxAmiForInstanceType = (instanceType: pulumi.Input<string>) =>
  pulumi.output(instanceType).apply((value) => {
    const architecture = /^([a-z0-9]+)g(\.|$)/i.test(value) ? "arm64" : "x86_64";

    return aws.ssm.getParameterOutput({
      name: `/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-${architecture}`,
    }).value;
  });

export const createDockerHost = (name: string, args: DockerHostArgs): DockerHost => {
  const instanceType = args.instanceType ?? "t3.small";
  const defaultVpc = aws.ec2.getVpcOutput({ default: true });
  const defaultSubnets = aws.ec2.getSubnetsOutput({
    filters: [
      { name: "vpc-id", values: [defaultVpc.id] },
      { name: "default-for-az", values: ["true"] },
    ],
  });

  const subnetId = defaultSubnets.ids.apply((ids) => {
    if (!ids.length) {
      throw new Error("No default public subnet was found for the default VPC.");
    }

    return ids[0];
  });

  const securityGroup = new aws.ec2.SecurityGroup(`${name}-sg`, {
    description: "BSDAC single-host ingress",
    vpcId: defaultVpc.id,
    ingress: [
      {
        protocol: "tcp",
        fromPort: 80,
        toPort: 80,
        cidrBlocks: ["0.0.0.0/0"],
      },
      {
        protocol: "tcp",
        fromPort: 443,
        toPort: 443,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
  });

  const role = new aws.iam.Role(`${name}-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: "ec2.amazonaws.com",
    }),
  });

  new aws.iam.RolePolicyAttachment(`${name}-ssm-core`, {
    role: role.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
  });

  new aws.iam.RolePolicy(`${name}-app-data`, {
    role: role.id,
    policy: pulumi
      .all([args.bucketArn, args.tableArn])
      .apply(([bucketArn, tableArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["dynamodb:BatchWriteItem", "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Query", "dynamodb:Scan", "dynamodb:UpdateItem"],
              Resource: [tableArn],
            },
            {
              Effect: "Allow",
              Action: ["s3:GetBucketLocation", "s3:ListBucket"],
              Resource: [bucketArn],
            },
            {
              Effect: "Allow",
              Action: ["s3:DeleteObject", "s3:GetObject", "s3:PutObject"],
              Resource: [`${bucketArn}/*`],
            },
          ],
        }),
      ),
  });

  const instanceProfile = new aws.iam.InstanceProfile(`${name}-profile`, {
    role: role.name,
  });

  const instance = new aws.ec2.Instance(`${name}-instance`, {
    ami: amazonLinuxAmiForInstanceType(instanceType),
    associatePublicIpAddress: false,
    iamInstanceProfile: instanceProfile.name,
    instanceType,
    userDataReplaceOnChange: true,
    metadataOptions: {
      httpEndpoint: "enabled",
      httpTokens: "required",
    },
    rootBlockDevice: {
      volumeSize: 16,
      volumeType: "gp3",
    },
    subnetId,
    userData,
    vpcSecurityGroupIds: [securityGroup.id],
    tags: {
      Name: "bsdac-app-host",
    },
  });

  const elasticIp = new aws.ec2.Eip(`${name}-eip`, {
    domain: "vpc",
    instance: instance.id,
  });

  return {
    elasticIp,
    instance,
    instanceProfile,
    role,
    securityGroup,
  };
};
