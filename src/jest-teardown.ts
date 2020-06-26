import { DynamoDB } from 'aws-sdk';

export default async () => {
  const db = new DynamoDB({ region: 'eu-west-1', endpoint: 'http://localhost:8000' });
  await db.deleteTable({ TableName : 'Raps' }, (err) => {
    if (err) console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
  });
};