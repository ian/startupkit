import type { D1Database } from "@cloudflare/workers-types";

export interface DeductResult {
  success: boolean;
  creditsRemaining: number;
}

export async function deductCredits(
  db: D1Database,
  userId: string,
  amount: number,
  tool: string,
  description?: string,
): Promise<DeductResult> {
  const transactionId = crypto.randomUUID();

  const result = await db.batch([
    db
      .prepare(
        `UPDATE users SET
        credits = CASE WHEN credits >= ? THEN credits - ? ELSE 0 END,
        bonus_credits = CASE WHEN credits >= ? THEN bonus_credits ELSE bonus_credits - (? - credits) END
      WHERE id = ? AND (credits + bonus_credits) >= ?`,
      )
      .bind(amount, amount, amount, amount, userId, amount),
    db
      .prepare(
        `INSERT INTO credit_transactions (id, user_id, amount, type, tool, description)
       VALUES (?, ?, ?, 'debit', ?, ?)`,
      )
      .bind(transactionId, userId, -amount, tool, description || null),
  ]);

  const rowsAffected = result[0]?.meta?.changes ?? 0;

  if (rowsAffected === 0) {
    const user = await db
      .prepare("SELECT credits, bonus_credits FROM users WHERE id = ?")
      .bind(userId)
      .first<{
        credits: number;
        bonus_credits: number;
      }>();
    return {
      success: false,
      creditsRemaining: (user?.credits || 0) + (user?.bonus_credits || 0),
    };
  }

  const updated = await db
    .prepare("SELECT credits, bonus_credits FROM users WHERE id = ?")
    .bind(userId)
    .first<{
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
  responseData: unknown,
): Promise<void> {
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO tool_usage (id, user_id, tool, credits_used, request_data, response_data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      userId,
      tool,
      creditsUsed,
      JSON.stringify(requestData),
      JSON.stringify(responseData),
    )
    .run();
}
