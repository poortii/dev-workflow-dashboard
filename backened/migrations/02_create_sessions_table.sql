-- migrations/02_create_sessions_table.sql

CREATE TABLE user_sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);