import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx'
import { db } from '../infra/dynamodb';
import { buildDockerImage, cluster } from '../infra/ecs';
import { bucket } from '../infra/s3';

const makeBackendService = () => {
  const config = new pulumi.Config();
  const image = buildDockerImage('bsdac-backend-img', './server')
  const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-backend-alb', {
    external: true,
    securityGroups: cluster.securityGroups,
  });
  const listener = alb.createListener('bsdac-backend-listener', {
    external: true,
    port: 80,
  });
  new awsx.ecs.FargateService('bsdac-backend-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image,
            cpu: 102,
            memory: 50/*MB*/,
            portMappings: [ listener ],
            environment: [
              { name: 'SERVICE_PORT', value: config.require('servicePort') },
              { name: 'LOGIN_EMAIL', value: config.require('loginEmail') },
              { name: 'LOGIN_PASSWORD_SHA256', value: config.require('loginPasswordSha256') },
              { name: 'AWS_ACCESS_KEY_ID', value: config.require('awsAccessKeyId') },
              { name: 'AWS_SECRET_ACCESS_KEY', value: config.require('awsSecretAccessKey') },
              { name: 'AWS_REGION', value: config.require('awsRegion') },
              { name: 'DYNAMODB_ENDPOINT', value: db.urn },
              { name: 'S3_BUCKET_NAME', value: bucket.bucket },
              { name: 'S3_ENDPOINT', value: bucket.urn },
            ]
        },
    },
    desiredCount: 3,
  });
  return alb;
}

export const backend = makeBackendService();