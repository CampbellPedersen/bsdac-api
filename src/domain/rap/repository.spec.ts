import { RapRepository, inMemoryRapository } from './repository';

const theFirstRap = {
  id: 'rap-001',
  title: 'The First Rap',
  bonus: false,
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { name: 'bsdac', series: 1 },
};

const theSecondRap = {
  id: 'rap-002',
  title: 'The Second Rap',
  bonus: false,
  rapper: 'Dennis Nguyen',
  imageUrl: 'https://imgur.com/theSecondRap',
  appearedAt: { name: 'bsdac', series: 3 },
};

const baseTests = (repository: RapRepository) => () => {
  it('loads undefined when rap does not exist', async () => {
    await expect(repository.load('1')).resolves.toBeUndefined();
  });

  it('loads empty array when no raps are saved', async () => {
    await expect(repository.loadAll())
      .resolves.toHaveLength(0);
  });

  it('saves and loads one rap', async () => {
    await repository.save(theFirstRap);

    await expect(repository.load('rap-001'))
      .resolves.toStrictEqual(theFirstRap);
  });

  it('loads an array of one when one rap exists', async () => {
    await expect(repository.loadAll())
      .resolves.toStrictEqual([ theFirstRap ]);
  });

  it('overwrites one rap', async () => {
    const editedRap = { ...theFirstRap, title: 'Actually, scratch that' };
    await repository.save(editedRap);

    await expect(repository.load('rap-001'))
      .resolves.toStrictEqual(editedRap);

    await repository.save(theFirstRap);

    await expect(repository.load('rap-001'))
      .resolves.toStrictEqual(theFirstRap);
  });

  it('saves and loads individual raps', async () => {
    await repository.save(theSecondRap);

    await expect(repository.load('rap-001'))
      .resolves.toStrictEqual(theFirstRap);
    await expect(repository.load('rap-002'))
      .resolves.toStrictEqual(theSecondRap);
  });

  it('loads all raps', async () => {
    await expect(repository.loadAll())
      .resolves.toStrictEqual([ theFirstRap, theSecondRap ]);
  });
};

const inMemory = inMemoryRapository();
describe('in-memory-rap-repository', baseTests(inMemory));