import { DeleteTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

export default async () => {
  const db = new DynamoDBClient({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'DUMMYIDEXAMPLE',
      secretAccessKey: 'DUMMYEXAMPLEKEY',
    },
  });
  await db.send(new DeleteTableCommand({ TableName : 'Raps' }));
};
