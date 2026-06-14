/**
 * Migration: Upgrade the four "simpler Likert" categories to the refined
 * forced-choice house style (24 items each), matching the other seven categories.
 *
 * Targets: Service & Helps, Leadership, Administration, Exhortation & Encouragement.
 * Each had 20 single-statement items; this swaps in 24 forced-choice items written
 * to pit each gift against its most confusable neighbor (Leadership vs Administration,
 * Service do-it-yourself vs coordinate, Exhortation forward-momentum vs Shepherding
 * long-haul presence) for discriminant validity.
 *
 * For each category: deactivate the current active questions (preserved for history,
 * matching the migrate-categories.ts pattern) and insert the 24 new ones.
 *
 * Idempotent — checks a marker question per category before swapping, so a second
 * run is a no-op. Wrapped in a single transaction.
 *
 * NOTE: authored against the LIVE question bank (seed-data.ts is a stale legacy seed).
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project migrate-question-bank-upgrade.ts
 */

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const UPGRADES: { internal_name: string; public_name: string; questions: string[] }[] = [
  {
    internal_name: "service_helps",
    public_name: "Service & Helps",
    questions: [
      `If a project needed someone to actually set up the room and someone to make the plan for it, I'd rather be the one setting up.`,
      `I'd rather quietly handle a practical task myself than recruit and coordinate other people to do it.`,
      `When someone describes a need, my mind goes to what I could do about it before it goes to what I could say.`,
      `I get more satisfaction from finishing a tangible job well than from being recognized for it.`,
      `If my church needed someone to repair the broken equipment versus someone to write the policy about it, I'd take the repair.`,
      `I'd rather spend a Saturday helping a family move than attend a planning meeting about how to help families.`,
      `I notice the small physical things that are out of place or undone, and I tend to fix them without being asked.`,
      `I'm more comfortable serving behind the scenes than being up front, even when I'm capable of being up front.`,
      `When a job is tedious or repetitive, I can stay faithful to it longer than most people I know.`,
      `I'd rather be handed a clear task to complete than be asked to figure out the strategy.`,
      `When I see a need, waiting for someone to organize a response frustrates me more than just meeting it myself.`,
      `I show care for people more through practical help than through words of encouragement or advice.`,
      `If someone is overwhelmed, my instinct is to take a concrete task off their plate rather than to talk them through it.`,
      `I tend to stay late to clean up or finish what's left after most people have gone home.`,
      `I'd rather be the dependable person who always shows up than the visible person who gets the credit.`,
      `When I commit to a task, I follow through even after the initial enthusiasm has worn off.`,
      `I feel a low-level restlessness when I see a tangible need going unmet and no one acting on it.`,
      `I'd rather deliver the meal myself than donate the money for someone else to handle it.`,
      `People tend to rely on me for the hands-on work that keeps things actually running.`,
      `I find unglamorous, practical work genuinely satisfying rather than something to get through.`,
      `If I had a free hour at a church event, I'd gravitate toward helping in the kitchen or with setup rather than mingling.`,
      `I measure a good day partly by how many concrete things I actually got done for others.`,
      `I'd rather hear "that's fixed" than "that's a great idea" — finishing matters more to me than proposing.`,
      `When I'm being served and can't contribute anything practical in return, I feel a little uncomfortable.`,
    ],
  },
  {
    internal_name: "leadership",
    public_name: "Leadership",
    questions: [
      `If a group needed someone to set the overall direction and someone to organize the details of carrying it out, I'd take the direction.`,
      `I'd rather launch something new and uncertain than keep something existing running smoothly.`,
      `When a group is stuck and unsure where to go, I feel a strong pull to step in and name a way forward.`,
      `I'm willing to take the first step toward a new direction even when no one else is ready to move.`,
      `I tend to see what a team or ministry could become, not just what it currently is.`,
      `I'd rather rally people around a compelling goal than build the system that keeps the goal on track.`,
      `I'm more energized by casting a vision for something than by managing the work it takes to get there.`,
      `People tend to look to me for a decision when the path forward is unclear, even when I hold no title.`,
      `I'm comfortable making a call with incomplete information when waiting would cost the group momentum.`,
      `I often end up influencing the direction of a group simply because I'm willing to speak up first.`,
      `I'd rather take a risk on a promising new direction than settle for a safe but stagnant status quo.`,
      `When I disagree with where a group is heading, I say so clearly rather than going along to keep the peace.`,
      `I feel responsible for the outcomes of groups I'm part of, even when I'm not officially in charge.`,
      `I'm drawn to challenges that require initiative and courage more than to ones that require careful maintenance.`,
      `I naturally think several steps ahead about where things should be going, not just what's in front of me.`,
      `If a ministry needed a visionary to reimagine it versus a coordinator to run it well, I'd want the reimagining.`,
      `I'd rather develop other people into leaders than personally handle every important task myself.`,
      `When I see an opportunity others have missed, I feel compelled to mobilize people toward it.`,
      `I tend to motivate and align a team more naturally than I track the details of their work.`,
      `I'm more motivated by mission and purpose than by routine, stability, or predictability.`,
      `In a leaderless situation, I get restless until someone — often me — provides direction.`,
      `I'd rather be judged on whether the group went somewhere meaningful than on whether it ran without errors.`,
      `When I believe in a direction, I'm able to bring hesitant people along with me.`,
      `I think about where a group should be headed more than whether today's tasks got checked off.`,
    ],
  },
  {
    internal_name: "administration",
    public_name: "Administration",
    questions: [
      `If a group needed someone to set the vision and someone to build the plan that makes it happen, I'd take the plan.`,
      `I'd rather turn a good idea into a working system than be the one who dreamed up the idea.`,
      `When someone proposes an exciting goal, I'm already thinking about the steps, owners, and timeline it would take.`,
      `I notice scheduling conflicts, resource gaps, and unclear roles before most people do.`,
      `I get more satisfaction from a project that ran without anything falling through the cracks than from the applause at the end.`,
      `I'd rather coordinate other people's contributions so the whole thing works than do all the hands-on work myself.`,
      `I find it satisfying to build a process that keeps running well even when I'm not personally involved.`,
      `When I see a disorganized process, I instinctively start redesigning it in my head.`,
      `I'm comfortable delegating tasks and following up to make sure they actually get done.`,
      `I'd rather prevent problems with a good system than heroically fix them after they happen.`,
      `People ask me to organize things because they trust nothing will slip through the cracks.`,
      `I tend to break a big goal into manageable steps with clear owners and deadlines.`,
      `I get energized by bringing order to something that was previously chaotic.`,
      `If a ministry needed someone to inspire the team versus someone to coordinate the logistics, I'd take the logistics.`,
      `I can keep track of multiple moving parts at once without losing the details.`,
      `I'm usually the person who ends up making the spreadsheet, the signup sheet, or the shared calendar.`,
      `I prefer clearly defined responsibilities and expectations over open-ended ambiguity.`,
      `I'd rather be the one quietly making sure the event runs smoothly than the one on stage.`,
      `I think naturally in terms of timelines, dependencies, and who is responsible for what.`,
      `When good plans fall apart from poor coordination, it bothers me more than it bothers most people.`,
      `I see my knack for organizing as a way to serve a mission, not just a personal preference for tidiness.`,
      `I'd rather build the structure that lets a vision succeed than be the one casting the vision.`,
      `After a project, I feel a quiet satisfaction about the coordination that the audience never noticed.`,
      `I'm more drawn to making an existing effort run efficiently than to dreaming up the next new effort.`,
    ],
  },
  {
    internal_name: "exhortation_encouragement",
    public_name: "Exhortation & Encouragement",
    questions: [
      `When someone is discouraged, I'd rather help them find their next step forward than simply sit with them in the discouragement.`,
      `People tend to leave a conversation with me more motivated than when they came in.`,
      `I notice the potential in someone before they see it in themselves, and I tell them.`,
      `If a friend is stuck, I'd rather help them see a way forward than reassure them that it's understandably hard.`,
      `I can confront someone with a hard truth in a way that leaves them encouraged rather than condemned.`,
      `I'd rather spur a hesitant person to take action than walk alongside them quietly for months.`,
      `When someone shares a struggle, I want to help them move on it, not just feel heard.`,
      `I find myself reaching out with a word of courage right when someone needs it, even unprompted.`,
      `I'd rather help someone believe they can change than analyze why they're stuck.`,
      `I naturally pair honest feedback with genuine confidence in the person's ability to grow.`,
      `I'm drawn toward the person in the room who looks ready to give up.`,
      `I can sense whether someone needs a gentle push or a soft place to land, and I adjust.`,
      `When people are overwhelmed, I help them see the one next faithful step instead of the whole mountain.`,
      `I'd rather light a fire under someone toward growth than commiserate about how hard things are.`,
      `I instinctively remind people of God's promises when they're losing heart.`,
      `After a hard conversation, I'm the one who follows up with words that rebuild the person's confidence.`,
      `I'd rather be the voice that says "you can do this, and here's why" than the one who fixes the problem for them.`,
      `Helping someone get unstuck and moving again energizes me more than almost anything else in ministry.`,
      `I tend to speak hope into situations and people that others have quietly written off.`,
      `If someone needed long-term weekly discipleship versus a timely push at a turning point, I'm more drawn to the turning point.`,
      `I look for chances to call out the good I see God already doing in someone.`,
      `I'd rather challenge someone toward their potential than protect them from a hard but necessary step.`,
      `When a group's morale is sinking, I feel compelled to put courage back into the room.`,
      `I'm quicker to urge someone toward their next act of obedience than to let them sit indefinitely in figuring it out.`,
    ],
  },
];

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const cat of UPGRADES) {
      const catRow = await client.query(
        "SELECT id FROM sg_categories WHERE internal_name = $1 AND is_active = TRUE",
        [cat.internal_name]
      );
      if (catRow.rows.length === 0) {
        console.log(`! Category "${cat.public_name}" not found/active — skipping.`);
        continue;
      }
      const categoryId = catRow.rows[0].id;

      // Idempotency marker: if the first new question is already active here, skip.
      const marker = await client.query(
        "SELECT 1 FROM sg_questions WHERE category_id = $1 AND question_text = $2 AND is_active = TRUE",
        [categoryId, cat.questions[0]]
      );
      if (marker.rows.length > 0) {
        console.log(`= "${cat.public_name}" already upgraded — skipping.`);
        continue;
      }

      // Deactivate current active questions (preserve history)
      const deact = await client.query(
        "UPDATE sg_questions SET is_active = FALSE, updated_at = now() WHERE category_id = $1 AND is_active = TRUE",
        [categoryId]
      );

      // Insert the 24 new forced-choice questions
      for (const q of cat.questions) {
        await client.query(
          "INSERT INTO sg_questions (category_id, question_text) VALUES ($1, $2)",
          [categoryId, q]
        );
      }

      console.log(
        `+ "${cat.public_name}": deactivated ${deact.rowCount}, inserted ${cat.questions.length}.`
      );
    }

    await client.query("COMMIT");
    console.log("Question-bank upgrade complete.");
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
