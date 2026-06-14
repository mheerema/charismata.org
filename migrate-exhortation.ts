/**
 * Migration: Add Exhortation & Encouragement as the 11th category.
 *
 * Creates the "exhortation_encouragement" category + 20 questions (display_order 11).
 *
 * Idempotent — safe to run multiple times (checks for the category by
 * internal_name before inserting). The run is wrapped in a single transaction,
 * so a partial failure rolls back cleanly.
 *
 * NOTE: the live question bank has diverged from seed-data.ts (production carries
 * a refined ~24-item bank per category). Any further question-level edits should
 * be authored against the live DB, not against seed-data.ts.
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project migrate-exhortation.ts
 */

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const EXHORTATION = {
  internal_name: "exhortation_encouragement",
  public_name: "Exhortation & Encouragement",
  description:
    "You have a God-given ability to come alongside others and move them forward — to comfort the discouraged, challenge the complacent, and spur people toward growth in Christ. Where the shepherd settles in for the long haul, the encourager shows up at the decisive moment with the word someone needs to keep going. This gift shows up as a knack for naming what is true and hopeful in a person, paired with an instinct to urge them toward their next step of obedience.",
  strengths:
    "You put courage back into people. You see potential others miss and call it out, and you know how to challenge someone without crushing them. Groups you're part of stay motivated and hopeful, and individuals on the edge of quitting often keep going because of a timely word from you. You turn truth into momentum.",
  cautions:
    "Encouragement can curdle into flattery if it isn't honest, or into pressure if it won't let someone sit in a hard season. Be careful not to rush people past grief toward 'looking on the bright side.' Make sure your challenge is grounded in Scripture, not just optimism or personality. And guard against needing to be the one who fixes everyone's discouragement — sometimes the most encouraging thing is simply to be present.",
  ministry_fit:
    "Discipleship and one-on-one mentoring, small group leadership, new believer follow-up, recovery and support ministries, coaching and accountability partnerships, hospital and crisis encouragement, prayer and care teams, leadership development",
  display_order: 11,
  questions: [
    "When someone is discouraged, I instinctively look for the true and hopeful thing I can say to them.",
    "People often leave a conversation with me feeling more motivated than when they came in.",
    "I tend to notice potential in others that they don't yet see in themselves.",
    "When I see someone on the verge of giving up, I feel a pull to come alongside and urge them to keep going.",
    "I can challenge someone about a hard truth without making them feel condemned.",
    "I often find the words that help someone take their next step forward.",
    "I'd rather help someone move toward growth than simply commiserate with them.",
    "When a friend is stuck, I naturally help them see a way forward rather than just agreeing it's hard.",
    "I look for opportunities to spur people on toward the good I see God doing in them.",
    "I find myself reaching out to someone right when they need a word of courage, even unprompted.",
    "I get energized by helping someone believe they can change and grow.",
    "I tend to pair honest feedback with genuine belief in the person.",
    "When someone shares a struggle, I want to help them act on it, not just feel heard.",
    "I naturally remind people of God's promises when they're losing heart.",
    "I'm drawn to the person in the room who seems ready to quit.",
    "I can sense when someone needs a gentle push versus when they need comfort, and I adjust.",
    "I often follow a hard conversation with words that rebuild someone's confidence.",
    "Helping someone get unstuck and moving again is deeply satisfying to me.",
    "I tend to speak hope into situations that others have written off.",
    "When people are overwhelmed, I help them see the one next faithful step instead of the whole mountain.",
  ],
};

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Add the Exhortation & Encouragement category (idempotent by internal_name)
    const existing = await client.query(
      "SELECT id FROM sg_categories WHERE internal_name = $1",
      [EXHORTATION.internal_name]
    );

    if (existing.rows.length === 0) {
      const catResult = await client.query(
        `INSERT INTO sg_categories (internal_name, public_name, description, strengths, cautions, ministry_fit, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          EXHORTATION.internal_name,
          EXHORTATION.public_name,
          EXHORTATION.description,
          EXHORTATION.strengths,
          EXHORTATION.cautions,
          EXHORTATION.ministry_fit,
          EXHORTATION.display_order,
        ]
      );
      const categoryId = catResult.rows[0].id;

      for (const questionText of EXHORTATION.questions) {
        await client.query(
          `INSERT INTO sg_questions (category_id, question_text) VALUES ($1, $2)`,
          [categoryId, questionText]
        );
      }
      console.log(
        `Inserted "${EXHORTATION.public_name}" + ${EXHORTATION.questions.length} questions.`
      );
    } else {
      console.log(
        `Category "${EXHORTATION.public_name}" already exists. Skipping insert.`
      );
    }

    await client.query("COMMIT");
    console.log("Migration complete.");
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
