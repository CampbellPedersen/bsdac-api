import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { cluster } from './infra/ecs';
import { frontend } from './client/infra';
import { backend } from './server/infra';

const config = new pulumi.Config();

const certificateArn = config.get('sslCertificateArn');
const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-alb', {
  external: true,
  securityGroups: cluster.securityGroups,
});
const client = frontend(alb);
const server = backend(alb);

const { listener } = alb.createListener('bsdac-web-listener', {
  external: true,
  protocol: certificateArn ? 'HTTPS' : 'HTTP',
  certificateArn,
  defaultAction: {
    targetGroupArn: client.targetGroup.arn,
    type: 'forward',
  }
});

alb.createListener('bsdac-redirect-listener', {
  external: true,
  protocol: 'HTTP',
  defaultAction: {
    type: 'redirect',
    redirect: {
        protocol: 'HTTPS',
        port: '443',
        statusCode: 'HTTP_301',
    },
  },
});

new aws.lb.ListenerRule('bsdac-backend-rule', {
  actions: [{
      targetGroupArn: server.targetGroup.arn,
      type: 'forward',
  }],
  conditions: [{ pathPattern: { values: ['/api/*'] }}],
  listenerArn: listener.arn,
  priority: 1,
});

const domain = config.require('domainName');
aws.route53.getZone({ name: domain }).then((hostedZone) => {
  new aws.route53.Record(
    domain,
    {
        name: domain,
        zoneId: hostedZone.zoneId,
        type: 'A',
        aliases: [
            {
                name: alb.loadBalancer.dnsName,
                zoneId: alb.loadBalancer.zoneId,
                evaluateTargetHealth: true,
            },
        ],
    });
  new aws.route53.Record(
    `www.${domain}`,
    {
      name: 'www',
      type: 'CNAME',
      records: [ domain ],
      zoneId: hostedZone.zoneId,
      ttl: 300,
    }
  )
});

export default {
  url: `www.${domain}`
};