import * as aws from '@pulumi/aws';

export const db = new aws.dynamodb.Table("Raps", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 1,
  writeCapacity: 1,
});