import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { db } from './infra/dynamodb';
import { backendRepository, frontendRepository } from './infra/ecr';
import { createDockerHost } from './infra/ec2';
import { createGithubDeployRole } from './infra/github';
import { bucket } from './infra/s3';

const config = new pulumi.Config();
const domain = config.get('domainName');
const instanceType = config.get('instanceType') || 't3.small';
const region = aws.getRegionOutput().name;

const host = createDockerHost('bsdac-host', {
  bucketArn: bucket.arn,
  ecrRepositoryArns: [frontendRepository.arn, backendRepository.arn],
  instanceType,
  tableArn: db.arn,
});

const githubDeploy = createGithubDeployRole('bsdac-github-deploy', {
  backendRepositoryArn: backendRepository.arn,
  ec2InstanceArn: host.instance.arn,
  frontendRepositoryArn: frontendRepository.arn,
  owner: 'CampbellPedersen',
  repo: 'bsdac-api',
});

if (domain) {
  const hostedZone = aws.route53.getZoneOutput({ name: domain, privateZone: false });

  new aws.route53.Record(domain, {
    name: domain,
    records: [host.elasticIp.publicIp],
    ttl: 300,
    type: 'A',
    zoneId: hostedZone.zoneId,
  });

  new aws.route53.Record(`www.${domain}`, {
    name: 'www',
    records: [domain],
    ttl: 300,
    type: 'CNAME',
    zoneId: hostedZone.zoneId,
  });
}

export const appBucketName = bucket.bucket;
export const appTableName = db.name;
export const backendEcrRepositoryName = backendRepository.name;
export const backendEcrRepositoryUrl = backendRepository.repositoryUrl;
export const deployPath = '/opt/bsdac/deploy';
export const frontendEcrRepositoryName = frontendRepository.name;
export const frontendEcrRepositoryUrl = frontendRepository.repositoryUrl;
export const githubDeployRoleArn = githubDeploy.role.arn;
export const githubDeployRoleName = githubDeploy.role.name;
export const instanceId = host.instance.id;
export const instanceProfileName = host.instanceProfile.name;
export const publicIp = host.elasticIp.publicIp;
export const publicDns = host.instance.publicDns;
export const recommendedInstanceType = instanceType;
export const regionName = region;
export const ssmManagedRoleName = host.role.name;
export const url = domain
  ? pulumi.interpolate`http://www.${domain}`
  : pulumi.interpolate`http://${host.elasticIp.publicIp}`;
