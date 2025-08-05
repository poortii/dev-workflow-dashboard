-- migrations/01_create_tables.sql

-- Drop tables if they exist to allow for easy re-creation during development
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS oauth_tokens;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    github_username TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Tokens
CREATE TABLE oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service TEXT, -- 'github' or 'trello'
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks (normalized view of GitHub issues + Trello cards)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source TEXT, -- 'github' or 'trello'
    source_id TEXT, -- issue/card id
    title TEXT,
    description TEXT,
    status TEXT, -- todo/in_progress/done
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some indexes for faster lookups
CREATE INDEX idx_tasks_user_id ON tasks (user_id);
CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens (user_id);