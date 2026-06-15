// Authored content for the three post-results surfaces (Confirm page, results
// callout, per-gift Next Step). Copy is final and verbatim — do not paraphrase.
// Keys in GIFT_NEXT_STEPS must match each category's public_name exactly, or the
// results-screen lookup silently returns nothing.

export interface GiftNextStep {
  reflect: string[];
  steps: string[];
  scripture: string;
}

// ─── Surface 3: per-gift "Next Step" content (all 11 categories) ───────────

export const GIFT_NEXT_STEPS: Record<string, GiftNextStep> = {
  "Word & Wisdom": {
    reflect: [
      "When you grasp something true about God, do you feel the pull to explain it to someone, or is understanding enough on its own?",
      "Whose understanding has actually grown because of how you opened the text to them — and how do you know?",
    ],
    steps: [
      "Take one passage you already understand well and teach it, out loud, to one person who would benefit — a child, a new believer, a friend over coffee.",
      "Ask someone you've taught what was unclear, and let the gap in their understanding, not your delivery, tell you where to grow.",
    ],
    scripture:
      "Second Timothy 2:2 — entrusting what you've learned to faithful people who can teach others.",
  },
  "Shepherding & Care": {
    reflect: [
      "Is there someone whose spiritual life you have quietly carried for more than a year, not just for an event or a season?",
      "Where does your care for people end — at the comfortable conversation, or does it follow them into the hard, slow, unglamorous middle?",
    ],
    steps: [
      "Reach out to one person who has gone quiet and ask how they actually are, with no agenda but to stay with them.",
      "Pick one person you already care for and commit, privately, to a defined stretch of consistent contact rather than waiting for the next crisis.",
    ],
    scripture:
      "First Peter 5:2 — shepherding the flock willingly, not under compulsion, and not for what you get from it.",
  },
  "Service & Helps": {
    reflect: [
      "When you serve, are you serving from joy or from a sense of obligation you can't quite put down?",
      "Which practical needs do you notice that almost everyone else walks past?",
    ],
    steps: [
      'Ask one ministry leader, "What unglamorous job is currently uncovered?" and quietly take it.',
      "Do one concrete task for someone who is overwhelmed instead of asking how you can help — take the thing off their plate yourself.",
    ],
    scripture:
      "Mark 10:45 — the Son of Man came not to be served but to serve.",
  },
  Leadership: {
    reflect: [
      "Where do you already see a way forward that the people around you haven't named yet — and what is keeping you from going first?",
      "When you've taken initiative before, did people end up better off, or did you mostly end up out front?",
    ],
    steps: [
      "Name one direction your group or ministry should move toward, say it out loud to the people who can act on it, and take the first visible step yourself.",
      "Pick one person with potential you can see and they can't, and put one real opportunity in front of them this week.",
    ],
    scripture:
      "Hebrews 13:7 — leaders whose way of life, not whose title, is worth imitating.",
  },
  Administration: {
    reflect: [
      "What is currently running on willpower and last-minute scrambling that a good system could carry instead?",
      "Do people rely on you to keep track of who is doing what — and have you mistaken your love of order for a calling to serve a mission?",
    ],
    steps: [
      "Take one effort that keeps falling through the cracks and build it the simple structure it needs — owners, steps, a shared place to track it.",
      "Hand one piece of that structure to someone else and follow up, so the system serves people rather than depending on you.",
    ],
    scripture:
      "First Corinthians 14:40 — let all things be done decently and in order, for the body's sake.",
  },
  "Evangelistic & Missional": {
    reflect: [
      "Whose face comes to mind when you think of someone far from God — and what would it actually cost you to speak to them?",
      "When you have shared the gospel before, did clarity and boldness come more easily to you than to most?",
    ],
    steps: [
      "Have one unhurried, honest conversation with someone outside the faith — not to close a sale, but to make the good news plain.",
      "Pray for one specific person by name daily this week and ask God for one natural opening to speak.",
    ],
    scripture:
      "Acts 8:35 — Philip beginning from the Scripture and telling the good news of Jesus.",
  },
  "Prophetic & Discernment": {
    reflect: [
      "When a teaching or decision sits wrong with you, can you trace the unease back to Scripture, or does it stay at the level of a hunch?",
      "Are you willing to name a hard truth out loud when staying quiet would keep things smoother?",
    ],
    steps: [
      "Take one thing you're being taught — a sermon, a book, a popular idea — and test it deliberately against the text, the way the Bereans did, rather than against your instinct.",
      "Where you sense something is off, do the work of articulating why from Scripture before you say anything, so your discernment serves the body instead of just unsettling it.",
    ],
    scripture:
      "Acts 17:11 — the Bereans examining the Scriptures daily to see whether these things were so.",
  },
  "Faith & Intercession": {
    reflect: [
      "Where are you trusting God for something the people around you have already written off as impossible?",
      "When you hear of a need, does prayer come first — or does it come after you've exhausted what you can fix yourself?",
    ],
    steps: [
      "Take one need that feels too big and pray for it specifically, by name, every day this week before doing anything else about it.",
      "Tell one discouraged person what you are asking God for on their behalf, so your faith steadies theirs.",
    ],
    scripture:
      "Hebrews 11:27 — enduring as seeing Him who is invisible.",
  },
  "Stewardship & Generosity": {
    reflect: [
      "Do you hold your money as something owned, or as something entrusted to deploy?",
      "Where could a gift of yours quietly meet a real need that no one is asking you to meet?",
    ],
    steps: [
      "Give something away this week — money, a meal, your table, your home — toward a specific need, and notice whether it costs you anything.",
      "Look for one high-impact opportunity others have overlooked and put your resources behind it before you're asked.",
    ],
    scripture:
      "Second Corinthians 9:7 — God loves a cheerful giver, one who has decided in his heart, not under compulsion.",
  },
  "Creative & Communication": {
    reflect: [
      "When you make something — words, images, music, design — does it draw people toward truth, or only toward the work itself?",
      "Where has your care for how something is said or made actually helped someone receive what was being said?",
    ],
    steps: [
      "Use one of your creative abilities this week in direct service of your church or someone in it, not just for your own portfolio.",
      "Ask one person whether something you made helped them understand or feel the truth more clearly, and let their answer guide you.",
    ],
    scripture:
      "Exodus 35:31–35 — Bezalel filled with the Spirit of God for skilled craftsmanship, and given the ability to teach others.",
  },
  "Exhortation & Encouragement": {
    reflect: [
      "Do people leave conversations with you more able to take their next step — or just more comforted?",
      "Can you tell the difference between someone who needs a gentle push and someone who needs a soft place to land?",
    ],
    steps: [
      "Reach out, unprompted, to one person who looks ready to give up and give them one honest, specific word of courage tied to a real next step.",
      "Where you'd normally only sympathize, name the good you see God already doing in the person and call them toward it.",
    ],
    scripture:
      "Hebrews 3:13 — exhort one another daily, that none be hardened.",
  },
};

// ─── Surface 2: results-interpretation callout ─────────────────────────────
// The body has four bold lead-ins. Each segment carries an optional `bold`
// prefix rendered <strong>, followed by `text`. Rendering the parts in order
// reproduces the original paragraph verbatim.

export interface CalloutSegment {
  bold?: string;
  text: string;
}

export const RESULTS_CALLOUT: {
  heading: string;
  body: string;
  segments: CalloutSegment[];
} = {
  heading: "Before you read your results",
  body: 'Hold these gently. A gift is not an excuse. A low score in mercy does not exempt you from showing mercy; every believer is still called to evangelize, give, serve, and care, whatever the inventory says (these are commands for the whole church, not assignments for a few). A low score is not a deficiency — it simply means your tendencies lie elsewhere, and what you lack the body around you supplies. Gifts are given "as He wills" (1 Corinthians 12:11), and they grow, deepen, and shift across seasons; today\'s result is a snapshot, not a sentence. This inventory is directional, not diagnostic — it points you toward where to look and whom to ask, not toward a fixed verdict on who you are.',
  segments: [
    { text: "Hold these gently. " },
    {
      bold: "A gift is not an excuse.",
      text: " A low score in mercy does not exempt you from showing mercy; every believer is still called to evangelize, give, serve, and care, whatever the inventory says (these are commands for the whole church, not assignments for a few). ",
    },
    {
      bold: "A low score is not a deficiency",
      text: " — it simply means your tendencies lie elsewhere, and what you lack the body around you supplies. ",
    },
    {
      bold: 'Gifts are given "as He wills" (1 Corinthians 12:11)',
      text: ", and they grow, deepen, and shift across seasons; today's result is a snapshot, not a sentence. ",
    },
    {
      bold: "This inventory is directional, not diagnostic",
      text: " — it points you toward where to look and whom to ask, not toward a fixed verdict on who you are.",
    },
  ],
};

// ─── Surface 1: "Confirm Your Gift in Community" page ──────────────────────

export interface ConfirmPrompt {
  title: string;
  quote: string;
  note?: string;
}

export interface ConfirmBodyCanName {
  prompt: string;
  question: string;
  body: string;
}

export const CONFIRM_CONTENT: {
  pageTitle: string;
  subtitle: string;
  intro: string;
  howToUse: string;
  prompts: ConfirmPrompt[];
  bodyCanName: ConfirmBodyCanName;
  affirmationsNote: string;
} = {
  pageTitle: "Confirm Your Gift in Community",
  subtitle: "An inventory can suggest. Only the body can confirm.",
  intro:
    'You just answered a set of questions about yourself. That is a useful starting point, but it is not the finish line. Paul says each believer is given a gift "for the common good" (1 Corinthians 12:7), and he spends most of 1 Corinthians 12 insisting that no member of the body can assess itself in isolation — the eye needs the hand, the head needs the feet (12:14–26). A gift is something the body sees you exercise, not something you assign yourself. When the early church needed to identify gifted servants, the congregation looked for those already known to be "full of the Spirit and of wisdom" and set them forward (Acts 6:3). So take what this inventory suggested and bring it to people who actually know you. Let them confirm it, correct it, or name something it missed.',
  howToUse:
    "Choose two or three people who have watched you serve over time — ideally in your church. A small group leader, a fellow volunteer, an elder, a friend who has worked alongside you. Show them your top results and walk through the three prompts below for each gift. You are not asking them to flatter you. You are asking them to tell you the truth about what they have actually seen.",
  prompts: [
    {
      title: "Does this match what you've seen in me?",
      quote:
        '"The inventory suggested [gift] is one of my strengths. Setting the test aside — does that line up with what you\'ve actually watched me do?"',
    },
    {
      title: "Where have you seen it bear fruit?",
      quote:
        '"Can you point to a specific time you saw this at work in me, and where it actually helped someone or built something up?"',
      note: "If they can't name a concrete instance, that is worth noticing. A real gift leaves evidence in other people's lives.",
    },
    {
      title: "Where have you seen it misfire?",
      quote:
        '"Where has this same tendency gone wrong — overstepped, tired people out, or served me more than the body?"',
      note: "Every gift has a shadow side. The people who love you are the ones who can name it kindly.",
    },
  ],
  bodyCanName: {
    prompt:
      "Then ask one more thing — and leave room for an answer the test couldn't give:",
    question:
      '"Is there a gift you would name in me that this inventory never asked about?"',
    body: 'An inventory can only measure what it thought to ask. The body sees what the instrument cannot. Some of the clearest gifting you carry may be something a list of questions would never surface — but the people who have served beside you have watched it for years. If two or three of them independently name the same thing, pay closer attention to that than to any score on a screen.',
  },
  affirmationsNote:
    'This conversation is the right home for every "people have always told me I\'m good at…" — an affirmation becomes confirmation when someone who knows you says it to your face, about something they have actually seen.',
};
