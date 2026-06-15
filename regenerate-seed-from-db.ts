/**
 * Regenerate seed-data.ts's CATEGORIES array from the LIVE database.
 *
 * The live question bank is the source of truth; seed-data.ts had drifted stale.
 * Run this after any DB content migration to keep the seed in sync, so a fresh
 * seed reproduces production.
 *
 * Reads active categories + their active questions (ordered by display_order /
 * created_at) and rewrites the `const CATEGORIES: Category[] = [...]` block in
 * seed-data.ts in place. Does not touch the imports, interface, or seed() logic.
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project regenerate-seed-from-db.ts
 */

import { Pool } from "pg";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SEED_PATH = join(process.cwd(), "seed-data.ts");

async function main() {
  const cats = await pool.query(
    `SELECT id, internal_name, public_name, description, strengths, cautions, ministry_fit, display_order
     FROM sg_categories WHERE is_active = TRUE ORDER BY display_order`
  );

  const blocks: string[] = [];
  let totalQuestions = 0;

  for (const c of cats.rows) {
    const qs = await pool.query(
      `SELECT question_text FROM sg_questions
       WHERE category_id = $1 AND is_active = TRUE ORDER BY created_at`,
      [c.id]
    );
    totalQuestions += qs.rows.length;

    const qLines = qs.rows
      .map((q) => `      ${JSON.stringify(q.question_text)},`)
      .join("\n");

    blocks.push(
      [
        `  {`,
        `    internal_name: ${JSON.stringify(c.internal_name)},`,
        `    public_name: ${JSON.stringify(c.public_name)},`,
        `    description: ${JSON.stringify(c.description)},`,
        `    strengths: ${JSON.stringify(c.strengths)},`,
        `    cautions: ${JSON.stringify(c.cautions)},`,
        `    ministry_fit: ${JSON.stringify(c.ministry_fit)},`,
        `    display_order: ${c.display_order},`,
        `    questions: [`,
        qLines,
        `    ],`,
        `  },`,
      ].join("\n")
    );
  }

  const arrayBody = blocks.join("\n");

  let src = readFileSync(SEED_PATH, "utf8");

  const startAnchor = "const CATEGORIES: Category[] = [";
  const endAnchor = "async function seed";
  const startIdx = src.indexOf(startAnchor);
  const endIdx = src.indexOf(endAnchor);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Could not locate CATEGORIES block anchors in seed-data.ts");
  }

  const before = src.slice(0, startIdx);
  const after = src.slice(endIdx);
  src = `${before}${startAnchor}\n${arrayBody}\n];\n\n${after}`;

  // Update the header count comment if present
  src = src.replace(
    / \* Creates \d+ categories and \d+ questions \([^)]*\)\./,
    ` * Creates ${cats.rows.length} categories and ${totalQuestions} questions (synced from live DB).`
  );

  writeFileSync(SEED_PATH, src, "utf8");
  console.log(
    `Regenerated seed-data.ts: ${cats.rows.length} categories, ${totalQuestions} questions.`
  );
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
