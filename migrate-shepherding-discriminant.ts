/**
 * Migration: De-cannibalize Shepherding & Care vs. the Mercy instinct.
 *
 * Mercy is folded (not a standalone category) by design. Two Shepherding items
 * were actually measuring the Mercy signature (presence-in-suffering / emotional
 * burden-bearing), which would inflate a mercy-gifted person's Shepherding score.
 * This swaps them for long-haul-discipleship items (forced-choice, pitting
 * sustained formation against in-the-moment comfort), so Shepherding measures its
 * own construct cleanly.
 *
 * Deactivates the two old items (history preserved) and inserts two new ones.
 * Idempotent (marker check). Wrapped in a transaction.
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project migrate-shepherding-discriminant.ts
 */

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CATEGORY = "shepherding_care";

const SWAPS: { old: string; new: string }[] = [
  {
    old: "When someone is going through grief or loss, I feel more comfortable being present than I think most people do.",
    new: "I'd rather stay committed to one person's growth over several years than be the one who shows up powerfully in someone's worst week.",
  },
  {
    old: "I tend to carry other people's burdens emotionally — sometimes to a degree that costs me energy.",
    new: "When I invest in someone, I'm thinking about who they're becoming over the long run more than how to comfort them in the moment.",
  },
];

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const catRow = await client.query(
      "SELECT id FROM sg_categories WHERE internal_name = $1 AND is_active = TRUE",
      [CATEGORY]
    );
    if (catRow.rows.length === 0) {
      throw new Error(`Category ${CATEGORY} not found/active`);
    }
    const categoryId = catRow.rows[0].id;

    for (const s of SWAPS) {
      // Idempotency: skip if the new item is already active here
      const exists = await client.query(
        "SELECT 1 FROM sg_questions WHERE category_id = $1 AND question_text = $2 AND is_active = TRUE",
        [categoryId, s.new]
      );
      if (exists.rows.length > 0) {
        console.log(`= already swapped: "${s.new.slice(0, 40)}..."`);
        continue;
      }

      const deact = await client.query(
        "UPDATE sg_questions SET is_active = FALSE, updated_at = now() WHERE category_id = $1 AND question_text = $2 AND is_active = TRUE",
        [categoryId, s.old]
      );
      await client.query(
        "INSERT INTO sg_questions (category_id, question_text) VALUES ($1, $2)",
        [categoryId, s.new]
      );
      console.log(
        `+ swapped (deactivated ${deact.rowCount}): "${s.old.slice(0, 38)}..." -> "${s.new.slice(0, 38)}..."`
      );
    }

    await client.query("COMMIT");
    console.log("Shepherding discriminant migration complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed (rolled back):", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
