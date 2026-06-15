/**
 * Migration: QA fixes on the upgraded question bank (from Cornelius's adversarial pass).
 *
 * - Administration: the "spreadsheet/signup/calendar" item names the artifact
 *   (least-veiled item in the bank) -> recast to a consequence behavior.
 * - Leadership: the "develop other people into leaders" item cross-loads onto the
 *   mentoring construct -> re-aim at leadership-initiative proper.
 * - Service & Helps: soften the third-party "people rely on me" framing -> first-person.
 *
 * Deactivates each old item (history preserved) and inserts the replacement.
 * Idempotent (marker check). Wrapped in a transaction.
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project migrate-item-fixes.ts
 */

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const FIXES: { category: string; old: string; new: string }[] = [
  {
    category: "administration",
    old: "I'm usually the person who ends up making the spreadsheet, the signup sheet, or the shared calendar.",
    new: "When a group effort is underway, people end up relying on me to keep track of who's doing what and by when.",
  },
  {
    category: "leadership",
    old: "I'd rather develop other people into leaders than personally handle every important task myself.",
    new: "I'd rather take responsibility for where a group is heading than wait for someone else to set the course.",
  },
  {
    category: "service_helps",
    old: "People tend to rely on me for the hands-on work that keeps things actually running.",
    new: "When something practical needs doing and no one has stepped up, I'm usually already doing it.",
  },
];

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const f of FIXES) {
      const catRow = await client.query(
        "SELECT id FROM sg_categories WHERE internal_name = $1 AND is_active = TRUE",
        [f.category]
      );
      if (catRow.rows.length === 0) {
        throw new Error(`Category ${f.category} not found/active`);
      }
      const categoryId = catRow.rows[0].id;

      const exists = await client.query(
        "SELECT 1 FROM sg_questions WHERE category_id = $1 AND question_text = $2 AND is_active = TRUE",
        [categoryId, f.new]
      );
      if (exists.rows.length > 0) {
        console.log(`= already fixed [${f.category}]`);
        continue;
      }

      const deact = await client.query(
        "UPDATE sg_questions SET is_active = FALSE, updated_at = now() WHERE category_id = $1 AND question_text = $2 AND is_active = TRUE",
        [categoryId, f.old]
      );
      await client.query(
        "INSERT INTO sg_questions (category_id, question_text) VALUES ($1, $2)",
        [categoryId, f.new]
      );
      console.log(`+ fixed [${f.category}] (deactivated ${deact.rowCount}, inserted 1)`);
    }

    await client.query("COMMIT");
    console.log("Item fixes complete.");
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
