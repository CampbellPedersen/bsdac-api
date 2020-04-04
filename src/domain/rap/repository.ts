interface Appearance {
  event: string
  series: number
}

interface PersistedRap {
  title: string
  artist: string
  appearedAt: Appearance
}

export type Rap = PersistedRap & { id: string }

export interface RapRepository {
  loadAll(): Promise<Rap[]>
  load(id: string): Promise<Rap | undefined>
  save(rap: Rap): Promise<void>
}

export const inMemoryRapository = (): RapRepository => {
  const store: { [id: string]: PersistedRap } = {};
  return {
    loadAll: async () => Object.keys(store).map(id => ({ id, ...store[id] })),
    load: async (id: string) => store[id] ? { id, ...store[id]} : undefined,
    save: async (rap: Rap) => {
      store[rap.id] = {
        appearedAt: rap.appearedAt,
        title: rap.title,
        artist: rap.artist
      };
    },
  };
};