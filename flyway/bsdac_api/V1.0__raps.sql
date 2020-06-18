CREATE TABLE raps (
  id                    TEXT PRIMARY KEY,
  title                 TEXT NOT NULL,
  lyrics                TEXT,
  rapper                TEXT NOT NULL,
  bonus                 BOOLEAN NOT NULL,
  image_url             TEXT NOT NULL,
  event_name            TEXT NOT NULL,  
  event_series          BIGINT NOT NULL
);