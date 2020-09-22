import * as awsx from '@pulumi/awsx';
import { buildDockerImage, cluster } from '../infra/ecs';

const makeFrontendService = (
  alb: awsx.elasticloadbalancingv2.ApplicationLoadBalancer
) => {
  const image = buildDockerImage('bsdac-frontend-img', './client');
  const targetGroup = alb.createTargetGroup('bsdac-frontend-target', { protocol: 'HTTP', healthCheck: { path: '/' }  });
  new awsx.ecs.FargateService('bsdac-frontend-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image,
            cpu: 64/*0.0625 vCPU*/,
            memory: 50/*MB*/,
            portMappings: [ targetGroup ],
        },
    },
    desiredCount: 1,
  });
  return targetGroup;
};

export const frontend = makeFrontendService;