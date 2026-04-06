import { Hono } from 'hono';
import type { Env, AuthVariables } from './middleware/auth.js';

export const creditsRouter = new Hono<{ Variables: AuthVariables }>();

creditsRouter.get('/balance', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = c.env.DB;

  const transactions = await db
    .prepare(
      `SELECT SUM(amount) as total FROM credit_transactions WHERE user_id = ?`
    )
    .bind(user.id)
    .first<{ total: number | null }>();

  const totalCredits = user.credits + user.bonusCredits;

  const usage = await db
    .prepare(
      `SELECT SUM(credits_used) as used FROM tool_usage WHERE user_id = ? AND created_at >= datetime('now', 'start of month')`
    )
    .bind(user.id)
    .first<{ used: number | null }>();

  return c.json({
    balance: totalCredits,
    used: usage?.used || 0,
    total: totalCredits,
  });
});

creditsRouter.get('/history', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = c.env.DB;

  const history = await db
    .prepare(
      `SELECT tool, COUNT(*) as count, SUM(credits_used) as credits_used, MAX(created_at) as last_used
       FROM tool_usage
       WHERE user_id = ?
       GROUP BY tool
       ORDER BY last_used DESC
       LIMIT 50`
    )
    .bind(user.id)
    .all<{ tool: string; count: number; credits_used: number; last_used: string }>();

  return c.json(
    history.results.map((row) => ({
      tool: row.tool,
      count: row.count,
      creditsUsed: row.credits_used,
      lastUsed: row.last_used,
    }))
  );
});

creditsRouter.post('/deduct', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { amount, tool, description } = await c.req.json<{
    amount: number;
    tool: string;
    description?: string;
  }>();

  if (!amount || amount <= 0) {
    return c.json({ error: 'Invalid amount' }, 400);
  }

  const db = c.env.DB;

  const totalCredits = user.credits + user.bonusCredits;

  if (totalCredits < amount) {
    return c.json({ error: 'Insufficient credits' }, 402);
  }

  const id = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO credit_transactions (id, user_id, amount, type, tool, description)
     VALUES (?, ?, ?, 'debit', ?, ?)`
  ).bind(id, user.id, -amount, tool, description || null).run();

  await db.prepare(
    `UPDATE users SET credits = CASE WHEN credits >= ? THEN credits - ? ELSE 0 END WHERE id = ?`
  ).bind(amount, amount, user.id).run();

  const updated = await db.prepare('SELECT credits FROM users WHERE id = ?').bind(user.id).first<{ credits: number }>();

  return c.json({
    success: true,
    creditsUsed: amount,
    creditsRemaining: updated?.credits || 0,
  });
});
