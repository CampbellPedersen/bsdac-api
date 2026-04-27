import { RapRepository, inMemoryRapository, EventName, Rap, dynamodbRapository } from './repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const theFirstRap: Rap = {
  id: 'rap-001',
  title: 'The First Rap',
  lyrics: 'Words mun',
  bonus: false,
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { name: EventName.BSDAC, series: 1 },
};

const theSecondRap: Rap = {
  id: 'rap-002',
  title: 'The Second Rap',
  bonus: false,
  rapper: 'Dennis Nguyen',
  imageUrl: 'https://imgur.com/theSecondRap',
  appearedAt: { name: EventName.BSDAC, series: 3 },
};

const tests = (repository: RapRepository) => () => {

  it('loads undefined when rap does not exist', async () => {
    await expect(repository.load('rap-001')).resolves.toBeUndefined();
  });

  it('loads empty array when no raps are saved', async () => {
    await expect(repository.loadAll())
      .resolves.toHaveLength(0);
  });

  it('saves and loads one rap', async () => {
    await repository.save(theFirstRap);
    const raps = await repository.loadAll();

    await expect(repository.load('rap-001'))
      .resolves.toEqual(theFirstRap);
  });

  it('loads an array of one when one rap exists', async () => {
    await expect(repository.loadAll())
      .resolves.toEqual([ theFirstRap ]);
  });

  it('overwrites one rap', async () => {
    const editedRap = { ...theFirstRap, title: 'Actually, scratch that' };
    await repository.save(editedRap);

    await expect(repository.load('rap-001'))
      .resolves.toEqual(editedRap);

    await repository.save(theFirstRap);

    await expect(repository.load('rap-001'))
      .resolves.toEqual(theFirstRap);
  });

  it('saves and loads individual raps', async () => {
    await repository.save(theSecondRap);

    await expect(repository.load('rap-001'))
      .resolves.toEqual(theFirstRap);
    await expect(repository.load('rap-002'))
      .resolves.toEqual(theSecondRap);
  });

  it('loads all raps', async () => {
    await expect(repository.loadAll())
      .resolves.toEqual(expect.arrayContaining([ theFirstRap, theSecondRap ]));
  });
};

const inMemory = inMemoryRapository();
describe('in-memory-rap-repository', tests(inMemory));

const maybeDescribeDynamodb = process.env.RUN_DYNAMODB_TESTS ? describe : describe.skip;
const client = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
  },
}));
const dynamodb = dynamodbRapository(client, 'Raps');
maybeDescribeDynamodb('dynamodb-rap-repository', tests(dynamodb));
