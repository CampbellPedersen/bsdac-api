import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { frontend } from './client/infra';
import { backend } from './server/infra';

const config = new pulumi.Config();

// const domain = config.require('domainName');
// aws.route53.getZone({ name: domain }).then((hostedZone) => {
//   new aws.route53.Record(
//     domain,
//     {
//         name: domain,
//         zoneId: hostedZone.zoneId,
//         type: 'A',
//         aliases: [
//             {
//                 name: frontend.loadBalancer.dnsName,
//                 zoneId: frontend.loadBalancer.zoneId,
//                 evaluateTargetHealth: true,
//             },
//         ],
//     });
// });

export default {
  frontendUrl: frontend.listeners[0].endpoint.hostname,
  backendUrl: backend.listeners[0].endpoint.hostname
};