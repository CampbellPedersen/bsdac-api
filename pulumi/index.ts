import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx';

const makeAlb = (cluster: awsx.ecs.Cluster) =>
  new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-alb', {
    external: true,
    securityGroups: cluster.securityGroups
  });

const makeWebListener = (alb: awsx.elasticloadbalancingv2.ApplicationLoadBalancer) =>
  alb.createListener('web', {
    port: 80,
    external: true
  });

const buildDockerImage = (path: string) =>
  awsx.ecs.Image.fromPath('bsdac-api-img', path);

const makeService = (
  cluster: awsx.ecs.Cluster,
  web: awsx.elasticloadbalancingv2.ApplicationListener,
  image: awsx.ecs.Image,
  config: pulumi.Config,
) =>
  new awsx.ecs.FargateService('bsdac-api-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image,
            cpu: 102,
            memory: 50/*MB*/,
            portMappings: [ web ],
            environment: [{
              name: 'SERVICE_PORT',
              value: config.require('servicePort'),
            }]
        },
    },
    desiredCount: 3,
  });

const config = new pulumi.Config();
const cluster = new awsx.ecs.Cluster('bsdac-api-cluster');
const alb = makeAlb(cluster);
const web = makeWebListener(alb);
const image = buildDockerImage('./..');
makeService(cluster, web, image, config);

// Step 5: Export the Internet address for the service.
export const url = web.endpoint.hostname;