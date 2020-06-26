import { DynamoDB } from 'aws-sdk';

export default async () => {
  const db = new DynamoDB({ region: 'eu-west-1', endpoint: 'http://localhost:8000' });
  await db.createTable({
    TableName : 'Raps',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH'}],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 }
  }, (err, data) => {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
  });
};