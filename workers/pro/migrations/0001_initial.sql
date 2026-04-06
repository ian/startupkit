-- StartupKit Pro Database Schema
-- Version: 0.1.0

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
    api_key TEXT UNIQUE,
    api_key_hash TEXT,
    credits INTEGER DEFAULT 10,
    bonus_credits INTEGER DEFAULT 10,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    name TEXT DEFAULT 'Default Key',
    last_used_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('debit', 'credit', 'bonus')),
    tool TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at);

-- Tool usage table
CREATE TABLE IF NOT EXISTS tool_usage (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tool TEXT NOT NULL,
    credits_used INTEGER NOT NULL,
    request_data TEXT,
    response_data TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_user ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool ON tool_usage(tool);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created ON tool_usage(created_at);

-- Domain provider settings
CREATE TABLE IF NOT EXISTS domain_provider_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('namecheap', 'porkbun')),
    api_key TEXT,
    api_secret TEXT,
    settings TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_domain_settings_user ON domain_provider_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_settings_provider ON domain_provider_settings(provider);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    external_subscription_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
