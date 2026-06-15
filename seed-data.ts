/**
 * Seed script for Spiritual Gifts Assessment
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node --skip-project seed-data.ts
 *
 * Creates 11 categories and 264 questions (synced from live DB).
 * Questions are "veiled behavioral" — they describe tendencies without
 * naming the spiritual gift, so users can't easily game the assessment.
 */

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface Category {
  internal_name: string;
  public_name: string;
  description: string;
  strengths: string;
  cautions: string;
  ministry_fit: string;
  display_order: number;
  questions: string[];
}

const CATEGORIES: Category[] = [
  {
    internal_name: "word_wisdom",
    public_name: "Word & Wisdom",
    description: "You have a God-given capacity to study, understand, and communicate biblical truth in ways that help others grasp and apply it. You are drawn to careful study, clear explanation, and helping people connect Scripture to life. This gift often shows up as a love of learning paired with a compulsion to share what you've learned.",
    strengths: "You bring clarity to complex ideas. People trust you to handle Scripture carefully and to present truth in an accessible way. You elevate the intellectual and spiritual depth of any group you're part of, and you help others move from confusion to conviction.",
    cautions: "Knowledge without love can become arrogance. Be careful not to value being right over being kind, or to treat people as projects to be corrected. Make sure your teaching serves people, not just ideas. Stay connected to community so your study doesn't become isolated.",
    ministry_fit: "Teaching (adult classes, small groups, new believers), curriculum development, writing, mentoring, apologetics, leading Bible studies, theological training",
    display_order: 1,
    questions: [
      "If a small group discussion goes off on a tangent, I find myself wanting to steer it back to what the text actually says.",
      "When I hear a sermon illustration that doesn't quite fit the passage, it distracts me more than it helps me.",
      "Given a choice between attending a worship concert or a Bible exposition lecture, I'd pick the lecture.",
      "I tend to organize my thoughts into outlines or frameworks before I try to explain something to someone else.",
      "I find myself mentally cross-referencing other Scripture passages while listening to a sermon.",
      "I would rather prepare a thorough Bible study lesson than lead an unstructured prayer time.",
      "If I overhear someone misquote or misapply a Bible verse, I have a hard time letting it go without saying something.",
      "I'm more drawn to a Sunday school class that works verse-by-verse through a book than one organized around life topics.",
      "When someone shares a popular Christian quote, I tend to check whether it actually lines up with Scripture before passing it along.",
      "I get more satisfaction from helping someone understand a doctrine than from helping them move through an emotional moment.",
      "I notice when a Bible translation chooses a word that shifts the meaning of a passage, and it matters to me.",
      "After a conference or retreat, I'm more likely to review my notes than to reflect on the relational connections I made.",
      "I find myself naturally breaking down complex ideas into steps or categories when explaining them to others.",
      "I'd rather lead a training session on biblical interpretation than coordinate a community service project.",
      "When a new believer asks me a question, I tend to give a fuller answer than they were probably looking for.",
      "I'm more energized by preparing to teach than by the actual moment of delivering the lesson.",
      "I gravitate toward conversations about ideas and concepts more than conversations about people and relationships.",
      "If my church needed someone to write a doctrinal position paper or someone to plan the annual picnic, I'd volunteer for the paper.",
      "When I read a difficult Bible passage, I'm more likely to dig into commentaries than to journal about how it makes me feel.",
      "I'd rather spend a free evening working through a theological book than catching up with a friend over coffee.",
      "When a friend asks for advice during a hard time, my instinct is to point them to a specific biblical principle rather than simply listen.",
      "If I had an extra hour each week, I'd be more likely to spend it studying than volunteering for a hands-on project.",
      "When I encounter a theological disagreement between two authors I respect, I want to trace it back to the original texts rather than just pick a side.",
      "I sometimes catch myself mentally outlining a better way to present a point while someone else is still making theirs.",
    ],
  },
  {
    internal_name: "shepherding_care",
    public_name: "Shepherding & Care",
    description: "You have a God-given heart for the long-term spiritual wellbeing of individuals. You are drawn to walking with people through life's highs and lows, providing counsel, encouragement, and steady presence. This gift shows up as deep relational investment and a willingness to carry burdens with others over time.",
    strengths: "You build trust naturally. People feel safe with you and know you won't disappear when things get hard. You help people process their experiences in light of the gospel, and you notice when someone is drifting before others do. Your presence provides stability in volatile seasons.",
    cautions: "You may take on too many people and burn out. Set boundaries so you can care well for a few rather than poorly for many. Be careful not to create dependency — your goal is to help people grow toward maturity, not toward needing you. Don't neglect your own soul while tending to others.",
    ministry_fit: "Small group leadership, pastoral care, counseling, mentoring, hospital and homebound visitation, support group facilitation, new member integration, crisis response teams",
    display_order: 2,
    questions: [
      "If a church committee needed someone to develop a year-long discipleship relationship with a struggling member versus someone to redesign the welcome process, I'd volunteer for the relationship.",
      "When someone shares something painful, my instinct is to sit with them in it rather than offer a solution or a Bible verse.",
      "I tend to remember the specific details of what someone told me about their struggles weeks or months later.",
      "If I notice someone has been absent from church for a few weeks, I'm more likely to reach out privately than to assume they're fine.",
      "I find myself gravitating toward the person sitting alone at a gathering rather than joining the lively group conversation.",
      "I'd rather walk with one person through a difficult year than organize an event that serves a hundred people.",
      "I'm more drawn to mentoring relationships that develop over months or years than to short-term volunteer commitments.",
      "After a group meeting, I tend to think about how specific individuals in the room are really doing rather than whether the meeting went well.",
      "I find it easier to ask someone a vulnerable follow-up question than most people seem to.",
      "If I had to choose, I'd rather be known as someone people trust with their secrets than as someone who teaches well or leads effectively.",
      "I'm more likely to send a personal check-in text than to post an encouraging comment in a group chat.",
      "When I think about what meaningful ministry looks like, I picture ongoing relationships more than programs or events.",
      "I'd rather have three close relationships where I know someone deeply than fifteen friendly acquaintances.",
      "I naturally notice shifts in someone's mood or demeanor, even when they haven't said anything is wrong.",
      "I find accountability conversations energizing when they're rooted in trust, not obligation.",
      "I sometimes follow up with someone after a hard conversation even when they haven't asked me to.",
      "I tend to measure the health of a church more by the depth of its relationships than by its attendance or programs.",
      "I'm drawn to small group leadership more for the relational investment than for the teaching opportunity.",
      "When I hear about someone's crisis, my first impulse is to show up or call rather than to add them to a prayer list.",
      "I can usually sense the difference between someone who needs advice and someone who needs to feel heard, and I adjust accordingly.",
      "I'd rather spend two hours in a deep one-on-one conversation than two hours at a large group social event.",
      "When a friend makes a decision I disagree with, my first feeling is usually concern for them rather than frustration with the choice.",
      "I'd rather stay committed to one person's growth over several years than be the one who shows up powerfully in someone's worst week.",
      "When I invest in someone, I'm thinking about who they're becoming over the long run more than how to comfort them in the moment.",
    ],
  },
  {
    internal_name: "service_helps",
    public_name: "Service & Helps",
    description: "You have a God-given drive to see practical needs and meet them — reliably, humbly, and without waiting to be asked. You are drawn to hands-on work that makes things function, whether it's setting up chairs, delivering meals, fixing what's broken, or quietly filling gaps that others walk past. This gift shows up as a bias toward action, a willingness to do unglamorous work, and deep satisfaction when your effort enables others to thrive.",
    strengths: "You are the reason things actually happen. While others talk, you act. Your reliability gives people confidence, and your willingness to serve without recognition creates a culture of humility. You often notice needs before anyone else does, and you meet them without fanfare. The body of Christ simply would not function without people like you.",
    cautions: "You may become resentful if your work goes unnoticed or if others seem to coast while you carry the load. Guard against measuring your worth by your productivity — rest is not laziness. Be careful not to serve out of compulsion or guilt rather than joy. Say no when you need to, and let others serve too.",
    ministry_fit: "Facilities and setup teams, meal ministry, practical care for the sick or elderly, event logistics, hospitality preparation, maintenance and repair, transportation ministry, nursery and childcare support",
    display_order: 3,
    questions: [
      "When I'm being served and can't contribute anything practical in return, I feel a little uncomfortable.",
      "If a project needed someone to actually set up the room and someone to make the plan for it, I'd rather be the one setting up.",
      "I'd rather quietly handle a practical task myself than recruit and coordinate other people to do it.",
      "When someone describes a need, my mind goes to what I could do about it before it goes to what I could say.",
      "I get more satisfaction from finishing a tangible job well than from being recognized for it.",
      "If my church needed someone to repair the broken equipment versus someone to write the policy about it, I'd take the repair.",
      "I'd rather spend a Saturday helping a family move than attend a planning meeting about how to help families.",
      "I notice the small physical things that are out of place or undone, and I tend to fix them without being asked.",
      "I'm more comfortable serving behind the scenes than being up front, even when I'm capable of being up front.",
      "When a job is tedious or repetitive, I can stay faithful to it longer than most people I know.",
      "I'd rather be handed a clear task to complete than be asked to figure out the strategy.",
      "When I see a need, waiting for someone to organize a response frustrates me more than just meeting it myself.",
      "I show care for people more through practical help than through words of encouragement or advice.",
      "If someone is overwhelmed, my instinct is to take a concrete task off their plate rather than to talk them through it.",
      "I tend to stay late to clean up or finish what's left after most people have gone home.",
      "I'd rather be the dependable person who always shows up than the visible person who gets the credit.",
      "When I commit to a task, I follow through even after the initial enthusiasm has worn off.",
      "I feel a low-level restlessness when I see a tangible need going unmet and no one acting on it.",
      "I'd rather deliver the meal myself than donate the money for someone else to handle it.",
      "I find unglamorous, practical work genuinely satisfying rather than something to get through.",
      "If I had a free hour at a church event, I'd gravitate toward helping in the kitchen or with setup rather than mingling.",
      "I measure a good day partly by how many concrete things I actually got done for others.",
      "I'd rather hear \"that's fixed\" than \"that's a great idea\" — finishing matters more to me than proposing.",
      "When something practical needs doing and no one has stepped up, I'm usually already doing it.",
    ],
  },
  {
    internal_name: "leadership",
    public_name: "Leadership",
    description: "You have a God-given capacity to see where a group needs to go and to move people toward that destination. You are drawn to setting direction, making decisions, and taking initiative when others are uncertain. This gift shows up as a combination of vision, conviction, and the ability to inspire others to follow — not through position or title, but through clarity and courage.",
    strengths: "You bring direction when there is none. In moments of confusion or inertia, you step forward with a clear sense of what should happen next. People trust your judgment and are willing to follow your lead because you communicate with conviction and act with integrity. You raise the ambition and focus of every group you're part of.",
    cautions: "Leadership without humility becomes domination. Be careful not to confuse your vision with God's will or to steamroll people who process differently than you. Listen before you lead. Surround yourself with people who will tell you the truth. Remember that leading well means developing other leaders, not accumulating followers.",
    ministry_fit: "Ministry team leadership, elder/deacon service, church planting, small group multiplication, strategic initiative leadership, vision casting, mentoring emerging leaders, organizational development",
    display_order: 4,
    questions: [
      "I think about where a group should be headed more than whether today's tasks got checked off.",
      "If a group needed someone to set the overall direction and someone to organize the details of carrying it out, I'd take the direction.",
      "I'd rather launch something new and uncertain than keep something existing running smoothly.",
      "When a group is stuck and unsure where to go, I feel a strong pull to step in and name a way forward.",
      "I'm willing to take the first step toward a new direction even when no one else is ready to move.",
      "I tend to see what a team or ministry could become, not just what it currently is.",
      "I'd rather rally people around a compelling goal than build the system that keeps the goal on track.",
      "I'm more energized by casting a vision for something than by managing the work it takes to get there.",
      "People tend to look to me for a decision when the path forward is unclear, even when I hold no title.",
      "I'm comfortable making a call with incomplete information when waiting would cost the group momentum.",
      "I often end up influencing the direction of a group simply because I'm willing to speak up first.",
      "I'd rather take a risk on a promising new direction than settle for a safe but stagnant status quo.",
      "When I disagree with where a group is heading, I say so clearly rather than going along to keep the peace.",
      "I feel responsible for the outcomes of groups I'm part of, even when I'm not officially in charge.",
      "I'm drawn to challenges that require initiative and courage more than to ones that require careful maintenance.",
      "I naturally think several steps ahead about where things should be going, not just what's in front of me.",
      "If a ministry needed a visionary to reimagine it versus a coordinator to run it well, I'd want the reimagining.",
      "When I see an opportunity others have missed, I feel compelled to mobilize people toward it.",
      "I tend to motivate and align a team more naturally than I track the details of their work.",
      "I'm more motivated by mission and purpose than by routine, stability, or predictability.",
      "In a leaderless situation, I get restless until someone — often me — provides direction.",
      "I'd rather be judged on whether the group went somewhere meaningful than on whether it ran without errors.",
      "When I believe in a direction, I'm able to bring hesitant people along with me.",
      "I'd rather take responsibility for where a group is heading than wait for someone else to set the course.",
    ],
  },
  {
    internal_name: "administration",
    public_name: "Administration",
    description: "You have a God-given ability to take a vision or plan and organize the people, resources, and processes needed to carry it out. You are drawn to building systems, coordinating logistics, and ensuring that things run smoothly and efficiently. This gift shows up as a keen eye for operational detail, a love of structure, and a deep satisfaction in seeing a well-run operation.",
    strengths: "You turn ideas into reality. Where leaders set the direction, you build the infrastructure to get there. You bring order to chaos, anticipate problems before they happen, and keep complex efforts on track. People trust that when you coordinate something, nothing falls through the cracks. You multiply the effectiveness of everyone around you.",
    cautions: "Don't let efficiency become an idol — sometimes the messy, relational path is the right one. Be careful not to control outcomes so tightly that you crowd out others' contributions or the Spirit's leading. Remember that the system exists to serve people, not the other way around. Resist the temptation to criticize those who are less organized than you.",
    ministry_fit: "Event coordination, volunteer scheduling, project management, financial administration, team operations, database and systems management, ministry logistics, facilities coordination, communication workflows",
    display_order: 5,
    questions: [
      "I'm more drawn to making an existing effort run efficiently than to dreaming up the next new effort.",
      "If a group needed someone to set the vision and someone to build the plan that makes it happen, I'd take the plan.",
      "I'd rather turn a good idea into a working system than be the one who dreamed up the idea.",
      "When someone proposes an exciting goal, I'm already thinking about the steps, owners, and timeline it would take.",
      "I notice scheduling conflicts, resource gaps, and unclear roles before most people do.",
      "I get more satisfaction from a project that ran without anything falling through the cracks than from the applause at the end.",
      "I'd rather coordinate other people's contributions so the whole thing works than do all the hands-on work myself.",
      "I find it satisfying to build a process that keeps running well even when I'm not personally involved.",
      "When I see a disorganized process, I instinctively start redesigning it in my head.",
      "I'm comfortable delegating tasks and following up to make sure they actually get done.",
      "I'd rather prevent problems with a good system than heroically fix them after they happen.",
      "People ask me to organize things because they trust nothing will slip through the cracks.",
      "I tend to break a big goal into manageable steps with clear owners and deadlines.",
      "I get energized by bringing order to something that was previously chaotic.",
      "If a ministry needed someone to inspire the team versus someone to coordinate the logistics, I'd take the logistics.",
      "I can keep track of multiple moving parts at once without losing the details.",
      "I prefer clearly defined responsibilities and expectations over open-ended ambiguity.",
      "I'd rather be the one quietly making sure the event runs smoothly than the one on stage.",
      "I think naturally in terms of timelines, dependencies, and who is responsible for what.",
      "When good plans fall apart from poor coordination, it bothers me more than it bothers most people.",
      "I see my knack for organizing as a way to serve a mission, not just a personal preference for tidiness.",
      "I'd rather build the structure that lets a vision succeed than be the one casting the vision.",
      "After a project, I feel a quiet satisfaction about the coordination that the audience never noticed.",
      "When a group effort is underway, people end up relying on me to keep track of who's doing what and by when.",
    ],
  },
  {
    internal_name: "evangelistic_missional",
    public_name: "Evangelistic & Missional",
    description: "You have a God-given burden for people who don't yet know Christ and a natural ability to build bridges between the gospel and their world. You are drawn to conversations with unbelievers, to crossing cultural boundaries, and to finding creative ways to make the faith accessible. This gift shows up as relational boldness and genuine curiosity about people far from God.",
    strengths: "You keep the church outward-focused. You build relationships with people others might avoid and naturally bring conversations toward matters of faith without being pushy. You remind believers that the mission extends beyond the walls of the church, and you model what it looks like to live sent.",
    cautions: "You may grow impatient with internal church life or dismiss the value of deep discipleship and theological precision. Remember that evangelism and edification go hand in hand. Be careful not to water down the message in an effort to make it palatable. Guard against measuring success by conversions alone.",
    ministry_fit: "Outreach events, neighborhood engagement, cross-cultural ministry, international missions, community partnerships, new visitor welcome teams, campus ministry, mercy and justice initiatives",
    display_order: 6,
    questions: [
      "If I had a free Saturday, I'd be more energized by volunteering at a neighborhood block party than by attending a church leadership retreat.",
      "When I meet someone new, I find myself naturally curious about their background and beliefs without feeling awkward about it.",
      "At a social event, I gravitate toward the person I don't know yet rather than catching up with someone I already know well.",
      "I'd rather help launch a new outreach initiative than improve an existing church program.",
      "When I think about my weekly routine, I notice I spend more time with people outside the church than many of my Christian friends do.",
      "I find it relatively natural to bring up spiritual topics in everyday conversation without it feeling forced.",
      "I'm more interested in learning about a different culture or worldview than in going deeper into a theological tradition I already hold.",
      "I feel more at home in a diverse or unfamiliar setting than most people in my church seem to.",
      "If someone told me they had no interest in church, I'd see that as an interesting starting point for conversation rather than a dead end.",
      "I'm more motivated by reaching people who've never heard the gospel than by helping mature believers grow further.",
      "When I pray, my thoughts tend to drift toward people I know who don't have a relationship with God.",
      "I'd rather spend time building trust with a neighbor who's far from faith than preparing a lesson for a group of believers.",
      "I tend to notice barriers that make it hard for outsiders to feel welcome at church, and they bother me.",
      "I'm more likely to invite a coworker to a casual hangout than to a church service as a first step.",
      "When I hear about an unreached people group or an underserved community, something in me wants to go rather than just give.",
      "I'm comfortable with long-term relational investment in someone's spiritual journey without needing to see quick results.",
      "If I had to choose between teaching a Sunday school class and leading a weekly conversation group at a local coffee shop for non-churchgoers, I'd pick the coffee shop.",
      "I tend to think about the reputation of the church in the broader community as much as I think about what happens inside its walls.",
      "I tend to form friendships with people outside the church more easily than most of the Christians I know.",
      "I'm more drawn to conversations with people who are skeptical about faith than to conversations about deepening faith with fellow believers.",
      "When my church discusses budget priorities, I instinctively advocate for outreach and community engagement over internal programs.",
      "I get more energized by being in a room where I'm the only Christian than I do by being in a room full of believers.",
      "I find cross-cultural experiences stimulating rather than draining, even when they push me outside my comfort zone.",
      "When I see a justice or mercy need in my city, my mind goes to how addressing it could open doors for the gospel.",
    ],
  },
  {
    internal_name: "prophetic_discernment",
    public_name: "Prophetic & Discernment",
    description: "You have a God-given sensitivity to truth, integrity, and alignment with God's Word. You can often sense when something is off — in a teaching, a decision, or a group dynamic — before others see it. This gift shows up as a commitment to honesty, a willingness to speak hard truths, and an instinct for identifying what is and isn't consistent with Scripture.",
    strengths: "You help the church stay honest and aligned with God's Word. You're willing to raise concerns others are thinking but won't say. You protect groups from drifting into error or complacency, and you bring moral clarity in confusing situations. Your courage to speak up is valuable even when it's uncomfortable.",
    cautions: "Truth without love can wound. Be careful that your desire for integrity doesn't become harshness or self-righteousness. Not every impression you have is from God — test your instincts against Scripture and the counsel of wise believers. Practice gentleness and humility alongside honesty.",
    ministry_fit: "Elder/leadership accountability, teaching evaluation, doctrinal review, conflict mediation, counseling discernment, prayer ministry, leadership advisory roles, theological education",
    display_order: 7,
    questions: [
      "I often sense that something is off in a situation before I can fully explain why, and I'm usually right.",
      "When a group is enthusiastically moving in a direction, I'm more likely to pause and ask hard questions than to join the momentum.",
      "I tend to see the root cause of a conflict while others are still focused on the surface-level symptoms.",
      "If I notice a pattern of compromise in a group I'm part of, I find it very difficult to stay quiet, even when speaking up will cost me relationally.",
      "I'm more unsettled by theological drift than by organizational messiness.",
      "When someone tells me about a situation, I can usually tell whether they're giving me the whole story.",
      "I'd rather be respected for my honesty than liked for my agreeableness.",
      "When a new program or initiative is proposed at church, my first instinct is to test it against biblical principles before getting excited about it.",
      "I sometimes feel burdened by an awareness of a problem that no one else in the room seems to see.",
      "I'm more cautious about adopting new ideas than most people I know — I need to examine them thoroughly first.",
      "When I sense something is spiritually wrong in a group dynamic, I'm more likely to name it directly than to hint at it or hope it resolves on its own.",
      "I find myself noticing the gap between what an organization says it values and how it actually operates.",
      "When I raise a concern, I try to be constructive, but I won't soften the truth to the point where the message is lost.",
      "I tend to ask 'Is this true?' before I ask 'Is this helpful?' or 'Is this kind?'",
      "I'm more troubled by a church that teaches something slightly wrong with great confidence than by one that teaches something right with less polish.",
      "I can usually sense the overall spiritual health or dysfunction of a group within a short time of being around them.",
      "I've learned that my initial gut reactions about people and situations tend to be confirmed over time.",
      "I'd rather serve in a role where I can provide honest feedback to leaders than in a role where I execute someone else's plan without input.",
      "When everyone in a group agrees too quickly, I get uncomfortable rather than relieved.",
      "I'd rather have a difficult but honest conversation than preserve harmony by leaving things unsaid.",
      "When I listen to a podcast or sermon from someone popular, I evaluate the content against Scripture rather than being carried along by the speaker's charisma.",
      "I tend to evaluate leaders by the consistency between their words and their behavior rather than by their talent or results.",
      "I'd rather risk being seen as too critical than let something misleading go unchallenged.",
      "When I meet someone in a leadership position, I instinctively assess their character before evaluating their competence.",
    ],
  },
  {
    internal_name: "faith_intercession",
    public_name: "Faith & Intercession",
    description: "You have a God-given capacity to trust God in situations where others hesitate and to sustain a life of persistent prayer. You are drawn to bringing needs before God with confidence and patience, and you often sense a call to pray for specific people or situations. This gift shows up as unusual spiritual stamina, a posture of dependence on God, and a conviction that prayer genuinely changes things.",
    strengths: "You anchor the people around you in dependence on God rather than human effort. Your prayers carry weight because they are persistent, specific, and faith-filled. You remind the church that its first response to any situation should be prayer, and your trust in God's faithfulness encourages others to take risks for His kingdom.",
    cautions: "Faith is not the same as presumption. Be careful not to treat your convictions as guarantees or to dismiss practical wisdom as a lack of faith. Avoid shaming others who process doubt differently than you. Stay grounded in Scripture so your faith is anchored in God's character, not in your own feelings.",
    ministry_fit: "Prayer teams, intercessory prayer ministry, prayer room coordination, fasting initiatives, pastoral prayer support, missions prayer partnerships, prayer mentoring, crisis prayer response",
    display_order: 8,
    questions: [
      "I can spend extended time in prayer without getting restless in a way that surprises most people I know.",
      "When others are anxious about an uncertain outcome, I tend to feel a calm that comes from trusting God is working, even without evidence.",
      "I'd rather spend an evening in prayer than an evening planning the details of an upcoming ministry event.",
      "I keep a running awareness — sometimes a written list — of specific people and situations I'm praying for over weeks or months.",
      "I've taken steps that didn't make practical sense because I felt clearly led by God, and I don't regret doing so.",
      "I'm more drawn to a prayer meeting than to a strategy session, even when both are about the same goal.",
      "I sometimes feel an unexpected burden to pray for a specific person or situation, even when I don't fully understand why.",
      "I find myself praying at odd moments throughout the day — while driving, waiting in line, between tasks — more than most people seem to.",
      "I'm genuinely comfortable with long seasons of waiting on God without seeing visible results, even though it's hard.",
      "If a church ministry was struggling, I'd be more inclined to organize a focused prayer effort than to restructure the program.",
      "I tend to interpret setbacks and delays as opportunities to trust God more deeply rather than as problems to fix.",
      "When I look back on my life, the moments I'm most grateful for are often tied to answered prayer rather than personal achievement.",
      "I sometimes sense a prompting during prayer that later turns out to be significant, and I've learned to pay attention to those.",
      "When I hear about God working in unexpected ways — provision, healing, changed hearts — it fuels my own faith more than sermons or books do.",
      "I'm more inclined to fast and pray about a major decision than to make a pros-and-cons list.",
      "I find intercessory prayer — praying on behalf of others — more energizing than personal devotional reading.",
      "I sometimes spend time in prayer not because I have specific requests but because I want to be present with God.",
      "If someone asked me how they should respond to a difficult situation, my honest first answer would usually be 'Have you prayed about it?'",
      "I've noticed that when I commit to praying about something consistently, I develop a sense of peace about the outcome before anything changes.",
      "When I hear about a crisis, my first response is to pray about it rather than to start problem-solving or researching.",
      "When a big decision needs to be made, my instinct is to wait and pray rather than to gather more data or take a vote.",
      "When someone shares a struggle, I'm more likely to offer to pray with them right then than to suggest a practical next step.",
      "I'd rather be part of a small group that prays together weekly than one that studies a book together weekly.",
      "When a situation seems impossible, I'm more likely to feel expectant than defeated.",
    ],
  },
  {
    internal_name: "stewardship_generosity",
    public_name: "Stewardship & Generosity",
    description: "You have a God-given impulse to give — your money, your time, your resources, your home — for the sake of others and the advance of God's kingdom. You see what you have as entrusted, not owned, and you look for strategic ways to deploy resources for maximum kingdom impact. This gift shows up as an open hand, a hospitable heart, and a keen sense of where generosity can make the biggest difference.",
    strengths: "You model what it looks like to hold things loosely and give freely. Your generosity funds ministry, blesses the marginalized, and inspires others to be generous. You often see needs before others do and act quickly. Your hospitality makes people feel welcomed, valued, and cared for.",
    cautions: "Be careful not to give in ways that create dependency or to use generosity as a means of control or recognition. Stewardship includes wise financial management, not just giving — don't neglect your own household's needs. Avoid judging others who give differently than you do.",
    ministry_fit: "Benevolence ministry, hospitality teams, missions funding, facilities hosting, meal ministry, financial planning support, resource drives, community aid coordination",
    display_order: 9,
    questions: [
      "I'm more likely to open my home to guests on a weeknight than most people I know, even when it means extra work.",
      "When I see someone struggling with a practical need — a car repair, a grocery bill, rent — I start figuring out how to help before they ask.",
      "I get more satisfaction from funding someone else's project or ministry than from spending the same amount on a personal experience.",
      "If I had a free Saturday, I'd be more likely to spend it hosting people at my home than attending a church training event.",
      "I think about my possessions primarily in terms of how they can be useful to others rather than how they benefit me.",
      "I find myself scanning for practical needs I can meet — a meal to deliver, a bill to cover, a ride to offer — almost automatically.",
      "I'd rather give a large anonymous gift than receive public recognition for a smaller one.",
      "When I prepare for guests, I tend to go overboard on making them feel comfortable and cared for, even when simple would be fine.",
      "I feel tension when I see money or resources being wasted or poorly managed, whether in a church or elsewhere.",
      "When I hear about a fundraising campaign for something I believe in, I feel a pull to give more than what's convenient.",
      "I tend to keep my personal spending modest not out of deprivation but because generosity feels more rewarding.",
      "If someone needs to borrow something I own, I'm more likely to feel glad it's being used than anxious about getting it back.",
      "I'd rather prepare a meal and bring it to someone having a rough week than send a thoughtful text or card.",
      "I'm more drawn to meeting immediate tangible needs — food, housing, transportation — than to addressing systemic issues through advocacy.",
      "I notice when a visitor at church seems uncomfortable or unsure where to go, and I move toward them to help before someone has to ask.",
      "If my church needed someone to manage the benevolence fund versus someone to lead the prayer team, I'd be drawn to the benevolence fund.",
      "When I think about what I want my life to add up to, the generosity I practiced matters more to me than the things I accumulated.",
      "If I received unexpected money, my first thought would tend to be about who I could share it with rather than what I could buy.",
      "I'd rather live below my means and give more away than maintain a comfortable lifestyle and give a standard amount.",
      "I tend to notice material needs — worn-out shoes, an empty fridge, a broken appliance — that others in the room walk right past.",
      "When I consider how to use a financial windfall, strategic giving opportunities come to mind before savings or personal purchases.",
      "I'm more motivated to support a missionary or church plant financially than to serve on a committee that oversees the church budget.",
      "When I evaluate how I spent my money over the past month, I feel best about the portions I gave away.",
      "I've given sacrificially in ways that genuinely affected my own budget, and I'd do it again.",
    ],
  },
  {
    internal_name: "creative_communication",
    public_name: "Creative & Communication",
    description: "You have a God-given ability to express truth, beauty, and the reality of God through creative means — writing, visual art, music, design, storytelling, or other forms of expression. You are drawn to shaping how people experience and encounter God's truth, and you instinctively look for fresh ways to communicate what matters most. This gift shows up as artistic sensibility paired with spiritual purpose.",
    strengths: "You help people encounter God in ways that transcend mere information. Your creativity makes truth accessible, memorable, and emotionally resonant. You bring beauty into spaces that might otherwise feel dry or routine, and you help the church communicate its message more effectively to the broader world.",
    cautions: "Creative work can become self-expression rather than service if unchecked. Stay open to feedback and collaboration — your art serves the body, not just your vision. Avoid the trap of perfectionism, which can delay obedience. Remember that substance matters more than style.",
    ministry_fit: "Worship arts (music, visual art, media), graphic design, writing and content creation, video production, stage and environment design, social media ministry, drama and storytelling, communications strategy",
    display_order: 10,
    questions: [
      "I'm more drawn to creating something — a design, a piece of writing, a video, a song — than to managing a process or organizing an event.",
      "I notice visual details in a room — colors, layout, lighting — that most people don't seem to register.",
      "I'd rather spend an afternoon working on a creative project than an afternoon organizing a filing system, even if both need doing.",
      "I find it hard to leave a presentation, poster, or document in a state that's functional but aesthetically rough.",
      "I get more energized by brainstorming new ways to communicate something than by refining a message that already works.",
      "When I attend a worship service, I notice the quality of the visuals, music, and overall production almost as much as the content.",
      "I tend to process my thoughts and emotions by making something — writing, sketching, composing, building — rather than by talking them through.",
      "I'm more bothered by a good message delivered poorly than by an average message delivered competently.",
      "I often see connections between seemingly unrelated ideas that help me explain complex things through metaphor or story.",
      "I'd rather create original content for a ministry than adapt or reuse existing materials, even when reuse would be faster.",
      "When I envision a finished project — an event, a space, a piece of communication — I can see the details in my mind before they exist.",
      "I tend to revise and polish my work more than most people think is necessary.",
      "When I collaborate with a team, I naturally gravitate toward the role of shaping the message or crafting the final output.",
      "I find it energizing to figure out how to make an old truth feel fresh and relevant to a new audience.",
      "I'd rather write, design, or produce something for a ministry initiative than recruit volunteers or manage logistics for it.",
      "When I see a piece of creative work done well — a film, a painting, a well-designed space — I feel motivated to create, not just to appreciate.",
      "I tend to think in terms of narrative and visual impact when planning how to communicate, even for simple things.",
      "If I'm asked to present information to a group, I'll spend significant time on the visual design and narrative flow, not just the content.",
      "I sometimes feel a tension between the desire to make something excellent and the pressure to just get it done, and excellence usually wins.",
      "When I have an idea to share, I spend as much time thinking about how to present it compellingly as I do developing the idea itself.",
      "When I hear a truth or concept, I instinctively start thinking about analogies, images, or stories that would bring it to life.",
      "If my church needed someone to redesign the bulletin or website versus someone to coordinate the volunteer schedule, I'd pick the design project.",
      "I'm drawn to the intersection of beauty and meaning; I believe how something looks and feels affects how deeply its message lands.",
      "I'm more likely to spend my free time on a creative hobby — photography, writing, music, art, design — than on a social or athletic one.",
    ],
  },
  {
    internal_name: "exhortation_encouragement",
    public_name: "Exhortation & Encouragement",
    description: "You have a God-given ability to come alongside others and move them forward — to comfort the discouraged, challenge the complacent, and spur people toward growth in Christ. Where the shepherd settles in for the long haul, the encourager shows up at the decisive moment with the word someone needs to keep going. This gift shows up as a knack for naming what is true and hopeful in a person, paired with an instinct to urge them toward their next step of obedience.",
    strengths: "You put courage back into people. You see potential others miss and call it out, and you know how to challenge someone without crushing them. Groups you're part of stay motivated and hopeful, and individuals on the edge of quitting often keep going because of a timely word from you. You turn truth into momentum.",
    cautions: "Encouragement can curdle into flattery if it isn't honest, or into pressure if it won't let someone sit in a hard season. Be careful not to rush people past grief toward 'looking on the bright side.' Make sure your challenge is grounded in Scripture, not just optimism or personality. And guard against needing to be the one who fixes everyone's discouragement — sometimes the most encouraging thing is simply to be present.",
    ministry_fit: "Discipleship and one-on-one mentoring, small group leadership, new believer follow-up, recovery and support ministries, coaching and accountability partnerships, hospital and crisis encouragement, prayer and care teams, leadership development",
    display_order: 11,
    questions: [
      "When someone is discouraged, I'd rather help them find their next step forward than simply sit with them in the discouragement.",
      "People tend to leave a conversation with me more motivated than when they came in.",
      "I notice the potential in someone before they see it in themselves, and I tell them.",
      "If a friend is stuck, I'd rather help them see a way forward than reassure them that it's understandably hard.",
      "I can confront someone with a hard truth in a way that leaves them encouraged rather than condemned.",
      "I'd rather spur a hesitant person to take action than walk alongside them quietly for months.",
      "When someone shares a struggle, I want to help them move on it, not just feel heard.",
      "I find myself reaching out with a word of courage right when someone needs it, even unprompted.",
      "I'd rather help someone believe they can change than analyze why they're stuck.",
      "I naturally pair honest feedback with genuine confidence in the person's ability to grow.",
      "I'm drawn toward the person in the room who looks ready to give up.",
      "I can sense whether someone needs a gentle push or a soft place to land, and I adjust.",
      "When people are overwhelmed, I help them see the one next faithful step instead of the whole mountain.",
      "I'd rather light a fire under someone toward growth than commiserate about how hard things are.",
      "I instinctively remind people of God's promises when they're losing heart.",
      "After a hard conversation, I'm the one who follows up with words that rebuild the person's confidence.",
      "I'd rather be the voice that says \"you can do this, and here's why\" than the one who fixes the problem for them.",
      "Helping someone get unstuck and moving again energizes me more than almost anything else in ministry.",
      "I tend to speak hope into situations and people that others have quietly written off.",
      "If someone needed long-term weekly discipleship versus a timely push at a turning point, I'm more drawn to the turning point.",
      "I look for chances to call out the good I see God already doing in someone.",
      "I'd rather challenge someone toward their potential than protect them from a hard but necessary step.",
      "When a group's morale is sinking, I feel compelled to put courage back into the room.",
      "I'm quicker to urge someone toward their next act of obedience than to let them sit indefinitely in figuring it out.",
    ],
  },
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if categories already exist
    const existing = await client.query("SELECT COUNT(*) as cnt FROM sg_categories");
    if (parseInt(existing.rows[0].cnt) > 0) {
      console.log("Categories already exist. Skipping seed.");
      await client.query("ROLLBACK");
      return;
    }

    for (const cat of CATEGORIES) {
      const catResult = await client.query(
        `INSERT INTO sg_categories (internal_name, public_name, description, strengths, cautions, ministry_fit, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [cat.internal_name, cat.public_name, cat.description, cat.strengths, cat.cautions, cat.ministry_fit, cat.display_order]
      );
      const categoryId = catResult.rows[0].id;

      for (const questionText of cat.questions) {
        await client.query(
          `INSERT INTO sg_questions (category_id, question_text) VALUES ($1, $2)`,
          [categoryId, questionText]
        );
      }

      console.log(`  Seeded ${cat.internal_name}: ${cat.questions.length} questions`);
    }

    await client.query("COMMIT");
    console.log("\nSeed complete: 10 categories, 200 questions");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

seed()
  .then(() => { pool.end(); process.exit(0); })
  .catch((err) => { console.error(err); pool.end(); process.exit(1); });
