import type { D1Database } from '@cloudflare/workers-types';

export interface DeductResult {
  success: boolean;
  creditsRemaining: number;
}

export async function deductCredits(
  db: D1Database,
  userId: string,
  amount: number,
  tool: string,
  description?: string
): Promise<DeductResult> {
  const user = await db.prepare('SELECT credits, bonus_credits FROM users WHERE id = ?').bind(userId).first<{
    credits: number;
    bonus_credits: number;
  }>();

  if (!user) {
    return { success: false, creditsRemaining: 0 };
  }

  const totalCredits = user.credits + user.bonus_credits;

  if (totalCredits < amount) {
    return { success: false, creditsRemaining: totalCredits };
  }

  const transactionId = crypto.randomUUID();
  await db.prepare(
    `INSERT INTO credit_transactions (id, user_id, amount, type, tool, description)
     VALUES (?, ?, ?, 'debit', ?, ?)`
  ).bind(transactionId, userId, -amount, tool, description || null).run();

  if (user.credits >= amount) {
    await db.prepare('UPDATE users SET credits = credits - ? WHERE id = ?').bind(amount, userId).run();
  } else {
    const fromBonus = amount - user.credits;
    await db.prepare('UPDATE users SET credits = 0, bonus_credits = bonus_credits - ? WHERE id = ?').bind(fromBonus, userId).run();
  }

  const updated = await db.prepare('SELECT credits, bonus_credits FROM users WHERE id = ?').bind(userId).first<{
    credits: number;
    bonus_credits: number;
  }>();

  return {
    success: true,
    creditsRemaining: (updated?.credits || 0) + (updated?.bonus_credits || 0),
  };
}

export async function logToolUsage(
  db: D1Database,
  userId: string,
  tool: string,
  creditsUsed: number,
  requestData: unknown,
  responseData: unknown
): Promise<void> {
  const id = crypto.randomUUID();
  await db.prepare(
    `INSERT INTO tool_usage (id, user_id, tool, credits_used, request_data, response_data)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, userId, tool, creditsUsed, JSON.stringify(requestData), JSON.stringify(responseData)).run();
}
