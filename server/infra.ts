import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx';
import { db } from '../infra/dynamodb';
import { buildDockerImage, cluster } from '../infra/ecs';
import { bucket } from '../infra/s3';

const makeBackendService = () => {
  const config = new pulumi.Config();
  const image = buildDockerImage('bsdac-backend-img', './server');
  const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-backend-alb', {
    external: true,
    securityGroups: cluster.securityGroups,
  });
  const targetGroup = alb.createTargetGroup('bsdac-backend-target', { port: 80, healthCheck: { path: '/healthz' }  });
  new awsx.ecs.FargateService('bsdac-backend-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image,
            cpu: 64/*0.0625 vCPU*/,
            memory: 500/*MB*/,
            portMappings: [ targetGroup ],
            environment: [
              { name: 'SERVICE_PORT', value: config.require('servicePort') },
              { name: 'LOGIN_EMAIL', value: config.require('loginEmail') },
              { name: 'LOGIN_PASSWORD_SHA256', value: config.require('loginPasswordSha256') },
              { name: 'AWS_ACCESS_KEY_ID', value: config.require('awsAccessKeyId') },
              { name: 'AWS_SECRET_ACCESS_KEY', value: config.require('awsSecretAccessKey') },
              { name: 'AWS_REGION', value: config.require('awsRegion') },
              { name: 'DYNAMODB_ENDPOINT', value: config.require('dynamodbEndpoint') },
              { name: 'DYNAMODB_TABLE_NAME', value: db.name },
              { name: 'S3_BUCKET_NAME', value: bucket.bucket },
              { name: 'S3_ENDPOINT', value: bucket.bucketDomainName },
            ]
        },
    },
    desiredCount: 1,
  });
  return targetGroup;
};

export const backend = makeBackendService();