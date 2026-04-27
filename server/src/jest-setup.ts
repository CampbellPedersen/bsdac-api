import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

export default async () => {
  const db = new DynamoDBClient({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'DUMMYIDEXAMPLE',
      secretAccessKey: 'DUMMYEXAMPLEKEY',
    },
  });
  await db.send(new CreateTableCommand({
    TableName : 'Raps',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH'}],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
  }));
};
