import { DynamoDB } from 'aws-sdk';

export interface Rap {
  id: string
  title: string
  lyrics?: string
  rapper: string
  bonus: boolean
  imageUrl: string
  appearedAt: Event
}

interface Event {
  name: EventName
  series: number
}

export enum EventName {
  BSDAC = 'BSDAC'
}

export interface RapRepository {
  loadAll(): Promise<Rap[]>
  load(id: string): Promise<Rap | undefined>
  save(rap: Rap): Promise<void>
}

export const dynamodbRapository = (
  client: DynamoDB.DocumentClient,
  tableName: string
): RapRepository => {
  return {
    loadAll: async () =>
      client.scan({ TableName: tableName })
        .promise()
        .then(res => res.Items as Rap[])
        .catch(err => { throw err; }),
    load: async (id: string) =>
      client.get({ TableName: tableName, Key: { id } })
        .promise()
        .then(res => res.Item as Rap)
        .catch(err => { throw err; }),
    save: async (rap: Rap) =>
      client.put({ TableName: tableName, Item: rap })
        .promise()
        .then(() => undefined)
        .catch(err => { throw err; }),
  };
};

export const inMemoryRapository = (): RapRepository => {
  const store: { [id: string]: Rap } = {};
  return {
    loadAll: async () => Object.keys(store).map(id => ({ id, ...store[id] })),
    load: async (id: string) => store[id],
    save: async (rap: Rap) => {
      store[rap.id] = {
        id: rap.id,
        title: rap.title,
        lyrics: rap.lyrics,
        rapper: rap.rapper,
        bonus: rap.bonus,
        imageUrl: rap.imageUrl,
        appearedAt: rap.appearedAt,
      };
    },
  };
};