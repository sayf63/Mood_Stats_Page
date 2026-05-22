-- Create the players table
CREATE TABLE IF NOT EXISTS players (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  kills       INTEGER NOT NULL DEFAULT 0,
  deaths      INTEGER NOT NULL DEFAULT 0,
  joined      DATE NOT NULL,
  last_played DATE NOT NULL
);

-- Seed player data
INSERT INTO players (username, kills, deaths, joined, last_played) VALUES
  ('SayfSlays',    1842,  430,  '2023-03-12', '2024-02-19'),
  ('NightOwl99',   1200,  800,  '2022-11-05', '2023-02-18'),
  ('FragMachine',  3100,  950,  '2021-06-20', '2022-02-17'),
  ('GhostStep',     740, 1100,  '2023-08-01', '2024-01-30'),
  ('ZeroRecoil',   2200,  600,  '2022-04-14', '2024-02-20'),
  ('PixelReaper',   980,  980,  '2023-01-22', '2024-02-10'),
  ('CrypticAim',   1560,  720,  '2022-07-30', '2026-02-15'),
  ('VoidWalker',   2900, 1200,  '2021-12-01', '2024-02-21'),
  ('StormBreaker',  450,  390,  '2023-10-10', '2024-02-05'),
  ('IronSights',   1700,  850,  '2022-09-18', '2025-02-12')
ON CONFLICT (username) DO NOTHING;