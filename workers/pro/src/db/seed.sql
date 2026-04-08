-- Seed data for testing

-- Insert a test user
INSERT INTO users (id, email, password_hash, plan, api_key)
VALUES (
    'test_user_001',
    'test@example.com',
    '$2a$10$...', -- bcrypt hash placeholder
    'starter',
    'sk_test_123456789'
);

-- Insert credit account for test user
INSERT INTO credit_accounts (id, user_id, balance, lifetime_credits, plan)
VALUES (
    'credit_001',
    'test_user_001',
    10,
    10,
    'starter'
);

-- Insert user preferences
INSERT INTO user_preferences (user_id, domain_provider)
VALUES ('test_user_001', 'namecheap');

-- Insert sample API keys (placeholder values)
INSERT INTO api_keys (id, user_id, provider, key_encrypted, key_hash)
VALUES (
    'key_001',
    'test_user_001',
    'dataforseo',
    'encrypted_value_here',
    'hash_of_key'
);

-- Insert sample usage logs
INSERT INTO usage_logs (id, user_id, tool, credits_used, metadata)
VALUES
    ('log_001', 'test_user_001', 'trends.interest', 1, '{"query": "AI tools"}'),
    ('log_002', 'test_user_001', 'seo.overview', 3, '{"domain": "example.com"}'),
    ('log_003', 'test_user_001', 'domains.search', 5, '{"seed": "startup"}');
