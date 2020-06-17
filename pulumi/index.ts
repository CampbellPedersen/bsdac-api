import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

const config = new pulumi.Config();
// Step 1: Create an ECS Fargate cluster.
const cluster = new awsx.ecs.Cluster('bsdac-api-cluster');

// Step 2: Define the Networking for our service.
const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-alb', {
  external: true,
  securityGroups: cluster.securityGroups
});

const web = alb.createListener('web', {
  port: 80,
  external: true
});

// Step 3: Build and publish a Docker image to a private ECR registry.
const img = awsx.ecs.Image.fromPath('bsdac-api-img', './..');

// Step 4: Create a Fargate service task that can scale out.
const appService = new awsx.ecs.FargateService('bsdac-api-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image: img,
            cpu: 102 /*10% of 1024*/,
            memory: 50 /*MB*/,
            portMappings: [ web ],
            environment: [{
              name: 'SERVICE_PORT',
              value: config.get('api:servicePort')
            }]
        },
    },
    desiredCount: 3,
});

// Step 5: Export the Internet address for the service.
export const url = web.endpoint.hostname;