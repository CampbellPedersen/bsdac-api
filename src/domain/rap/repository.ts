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

export const dynamodbRapository = (db: DynamoDB.DocumentClient): RapRepository => {
  const TableName = 'Raps';
  return {
    loadAll: async () =>
      db.scan({ TableName })
        .promise()
        .then(res => res.Items)
        .catch(err => err),
    load: async (id: string) =>
      db.get({ TableName, Key: { id } })
        .promise()
        .then(res => res.Item)
        .catch(err => err),
    save: async (rap: Rap) =>
      db.put({ TableName, Item: rap })
        .promise()
        .then(res => res)
        .catch(err => err),
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