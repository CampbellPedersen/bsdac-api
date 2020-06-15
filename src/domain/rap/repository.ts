import { Pool } from 'pg';

export interface Rap {
  id: string
  title: string
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
        SELECT id, title, rapper, bonus, image_url, event_name, event_series
        FROM bsdac_api.raps`
      );
      return result.rows.map(toRap);
    },
    load: async (id: string) => {
      const result = await pool.query(`
        SELECT id, title, rapper, bonus, image_url, event_name, event_series
        FROM bsdac_api.raps
        WHERE id = $1`,
        [id]
      );
      if (result.rowCount < 1) return undefined;

      return toRap(result.rows[0]);
    },
    save: async (rap: Rap) => {
      await pool.query(`
        INSERT INTO bsdac_api.raps (id, title, rapper, bonus, image_url, event_name, event_series)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id)
        DO UPDATE
        SET title = $2, rapper = $3, bonus = $4, image_url = $5, event_name = $6, event_series = $7`,
        [rap.id, rap.title, rap.rapper, rap.bonus, rap.imageUrl, rap.appearedAt.name, rap.appearedAt.series]);
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
        rapper: rap.rapper,
        bonus: rap.bonus,
        imageUrl: rap.imageUrl,
        appearedAt: rap.appearedAt,
      };
    },
  };
};