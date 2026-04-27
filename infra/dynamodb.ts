import * as aws from '@pulumi/aws';

export const db = new aws.dynamodb.Table("Raps", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  billingMode: "PAY_PER_REQUEST",
});
