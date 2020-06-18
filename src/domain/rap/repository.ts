import { Pool } from 'pg';

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

export const postgresqlRapository = (
  pool: Pool,
): RapRepository => {
  const toRap = (row: any) => ({
    id: row.id,
    title: row.title,
    lyrics: row.lyrics ? row.lyrics : undefined,
    rapper: row.rapper,
    bonus: row.bonus,
    imageUrl: row.image_url,
    appearedAt: {
      name: row.event_name,
      series: Number(row.event_series)
    }
  });

  return {
    loadAll: async () => {
      const result = await pool.query(`
        SELECT id, title, lyrics, rapper, bonus, image_url, event_name, event_series
        FROM bsdac_api.raps`
      );
      return result.rows.map(toRap);
    },
    load: async (id: string) => {
      const result = await pool.query(`
        SELECT id, title, lyrics, rapper, bonus, image_url, event_name, event_series
        FROM bsdac_api.raps
        WHERE id = $1`,
        [id]
      );
      if (result.rowCount < 1) return undefined;

      return toRap(result.rows[0]);
    },
    save: async (rap: Rap) => {
      await pool.query(`
        INSERT INTO bsdac_api.raps (id, title, lyrics, rapper, bonus, image_url, event_name, event_series)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id)
        DO UPDATE
        SET title = $2, lyrics = $3, rapper = $4, bonus = $5, image_url = $6, event_name = $7, event_series = $8`,
        [rap.id, rap.title, rap.lyrics, rap.rapper, rap.bonus, rap.imageUrl, rap.appearedAt.name, rap.appearedAt.series]);
    }
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