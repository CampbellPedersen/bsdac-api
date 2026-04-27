import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

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
  BSDAC = 'BSDAC',
  BEATS = 'BEATS',
}

export interface RapRepository {
  loadAll(): Promise<Rap[]>
  load(id: string): Promise<Rap | undefined>
  save(rap: Rap): Promise<void>
}

export const dynamodbRapository = (
  client: DynamoDBDocumentClient,
  tableName: string
): RapRepository => {
  return {
    loadAll: async () => {
      const response = await client.send(new ScanCommand({ TableName: tableName }));
      return response.Items as Rap[];
    },
    load: async (id: string) => {
      const response = await client.send(new GetCommand({ TableName: tableName, Key: { id } }));
      return response.Item as Rap;
    },
    save: async (rap: Rap) => {
      await client.send(new PutCommand({ TableName: tableName, Item: rap }));
    },
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
