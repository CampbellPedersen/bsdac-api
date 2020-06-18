import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

const makeAlb = (cluster: awsx.ecs.Cluster) =>
  new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-alb', {
    external: true,
    securityGroups: cluster.securityGroups
  });

const makeWebListener = (alb: awsx.elasticloadbalancingv2.ApplicationLoadBalancer) =>
  alb.createListener('bscap-api-listener', {
    port: 80,
    external: true
  });

const buildDockerImage = (path: string) =>
  awsx.ecs.Image.fromPath('bsdac-api-img', path);

const buildRoute53Record = async (
  domain: string,
  alb: awsx.elasticloadbalancingv2.ApplicationLoadBalancer,
) =>
  new aws.route53.Record(
    domain,
    {
        name: domain,
        zoneId: (await aws.route53.getZone({ name: domain })).zoneId,
        type: 'A',
        aliases: [
            {
                name: alb.loadBalancer.dnsName,
                zoneId: alb.loadBalancer.zoneId,
                evaluateTargetHealth: true,
            },
        ],
    });

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

// Steps
const config = new pulumi.Config();
const domainName = config.require('domainName');
const cluster = new awsx.ecs.Cluster('bsdac-api-cluster');
const alb = makeAlb(cluster);
const web = makeWebListener(alb);
buildRoute53Record(domainName, alb);
const image = buildDockerImage('./..');
makeService(cluster, web, image, config);

export const url = web.endpoint.hostname;