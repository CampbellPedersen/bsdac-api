import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { frontend } from './client/infra';
import { backend } from './server/infra';

const config = new pulumi.Config();

new aws.lb.ListenerRule("bsdac-backend-rule", {
  actions: [{
      targetGroupArn: backend.targetGroup.arn,
      type: "forward",
  }],
  conditions: [{ pathPattern: { values: ["/api/*"] }}],
  listenerArn: frontend.listener.arn,
  priority: 100,
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
                name: frontend.loadBalancer.loadBalancer.dnsName,
                zoneId: frontend.loadBalancer.loadBalancer.zoneId,
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
      ttl: 5,
    }
  )
});

export default {
  frontendUrl: frontend.loadBalancer.loadBalancer.dnsName,
  backendUrl: backend.loadBalancer.loadBalancer.dnsName,
  url: `www.${domain}`
};