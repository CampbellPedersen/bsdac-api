import * as awsx from "@pulumi/awsx";

export const cluster = new awsx.ecs.Cluster('bsdac-cluster');

export const buildDockerImage = (name: string, path: string) => awsx.ecs.Image.fromPath(name, path);