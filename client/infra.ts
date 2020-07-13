import * as awsx from "@pulumi/awsx";
import { buildDockerImage, cluster } from "../infra/ecs";

const makeFrontendService = () => {
  const image = buildDockerImage('bsdac-frontend-img', './client')
  const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer('bsdac-frontend-alb', {
    external: true,
    securityGroups: cluster.securityGroups,
  });
  const listener = alb.createListener('bsdac-frontend-listener', {
    external: true,
    port: 80,
  });
  new awsx.ecs.FargateService('bsdac-frontend-svc', {
    cluster,
    taskDefinitionArgs: {
        container: {
            image,
            cpu: 102,
            memory: 50/*MB*/,
            portMappings: [ listener ]
        },
    },
    desiredCount: 3,
  });
  return alb;
}

export const frontend = makeFrontendService();