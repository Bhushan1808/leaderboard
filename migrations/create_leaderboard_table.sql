-- Migration: create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  email TEXT PRIMARY KEY,
  score INTEGER NOT NULL DEFAULT 0
);
