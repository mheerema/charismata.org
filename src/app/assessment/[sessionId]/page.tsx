"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { GIFT_NEXT_STEPS, RESULTS_CALLOUT } from "@/lib/gift-content";

const QUESTIONS_PER_PAGE = 12;

const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree", short: "-2" },
  { value: 2, label: "Disagree", short: "-1" },
  { value: 3, label: "Neutral", short: "0" },
  { value: 4, label: "Agree", short: "+1" },
  { value: 5, label: "Strongly Agree", short: "+2" },
];

interface SessionQuestion {
  id: string;
  question_id: string;
  question_text: string;
  display_order: number;
}

interface ScoreWithCategory {
  category_id: string;
  public_name: string;
  description: string | null;
  strengths: string | null;
  cautions: string | null;
  ministry_fit: string | null;
  raw_score: number;
  average_score: number;
  rank: number;
}

export default function AssessmentPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [questions, setQuestions] = useState<SessionQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState<"started" | "submitted">("started");
  const [scores, setScores] = useState<ScoreWithCategory[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [churchName, setChurchName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingResponses = useRef<Record<string, number>>({});

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );
  const answeredCount = Object.keys(responses).length;
  const totalCount = questions.length;
  const progressPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  // Load session
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setResponses(data.responses || {});
        setStatus(data.session?.status || "started");
        setCurrentPage(data.session?.current_page || 0);
        setScores(data.scores || []);
        setParticipantName(data.session?.participant_name || "");
        setChurchName(data.session?.church_name || "");
        setGroupName(data.session?.group_name || "");
      })
      .catch(() => setError("Failed to load assessment"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Debounced save
  const saveResponses = useCallback(
    (newResponses: Record<string, number>, page?: number) => {
      Object.assign(pendingResponses.current, newResponses);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        const toSave = { ...pendingResponses.current };
        pendingResponses.current = {};
        try {
          await fetch(`/api/sessions/${sessionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: toSave,
              currentPage: page !== undefined ? page : currentPage,
            }),
          });
        } catch {
          // silent
        }
      }, 500);
    },
    [sessionId, currentPage]
  );

  const handleResponse = (questionId: string, value: number) => {
    setResponses((prev) => {
      const updated = { ...prev, [questionId]: value };
      saveResponses({ [questionId]: value });
      return updated;
    });
  };

  const handlePageChange = (newPage: number) => {
    // Flush pending saves
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    const toSave = { ...pendingResponses.current };
    pendingResponses.current = {};
    fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responses: Object.keys(toSave).length > 0 ? toSave : undefined,
        currentPage: newPage,
      }),
    }).catch(() => {});

    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (answeredCount < totalCount) {
      setError(`Please answer all questions. ${totalCount - answeredCount} remaining.`);
      return;
    }
    setSubmitting(true);
    setError(null);

    // Flush pending
    if (Object.keys(pendingResponses.current).length > 0) {
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: pendingResponses.current }),
      });
      pendingResponses.current = {};
    }

    try {
      const res = await fetch(`/api/sessions/${sessionId}/submit`, { method: "POST" });
      if (res.ok) {
        // Load results
        const resultsRes = await fetch(`/api/sessions/${sessionId}/results`);
        if (resultsRes.ok) {
          const data = await resultsRes.json();
          setScores(data.scores || []);
          setStatus("submitted");
        }
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to submit");
      }
    } catch {
      setError("Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-border border-t-accent rounded-full" />
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────
  if (status === "submitted" && scores.length > 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8">
        <div className="text-center">
          <p className="type-eyebrow text-accent mb-3">Charismata</p>
          <h1 className="type-h1 text-foreground">Your Results</h1>
          {participantName && (
            <p className="type-small text-muted-foreground mt-2">{participantName}</p>
          )}
        </div>

        {/* Results-interpretation callout */}
        <div className="bg-accent-subtle rounded-card p-6">
          <h2 className="type-h3 text-accent-strong mb-2">
            {RESULTS_CALLOUT.heading}
          </h2>
          <p className="type-small text-muted-foreground">
            {RESULTS_CALLOUT.segments.map((seg, i) => (
              <span key={i}>
                {seg.bold && (
                  <strong className="font-semibold text-foreground">{seg.bold}</strong>
                )}
                {seg.text}
              </span>
            ))}
          </p>
        </div>

        {/* Bar chart */}
        <div className="bg-surface rounded-card border border-border shadow-card p-6">
          <div className="space-y-3.5">
            {scores.map((score) => {
              const maxScore = 50;
              const widthPct = Math.round((score.raw_score / maxScore) * 100);
              const isTop1 = score.rank === 1;
              const isTop2 = score.rank <= 2;
              const isBottom2 = score.rank >= scores.length - 1;

              // Top-2 gifts in teal accent; the rest in a graduated neutral.
              const barColor = isTop1
                ? "bg-accent-strong"
                : isTop2
                ? "bg-accent"
                : isBottom2
                ? "bg-border-strong"
                : "bg-stone-400";

              return (
                <div key={score.category_id}>
                  <span className="sr-only">{score.public_name}: {widthPct}%</span>
                  <div className="flex items-center justify-between mb-1.5" aria-hidden="true">
                    <span
                      className={`type-small font-medium ${
                        isTop2 ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {score.public_name}
                    </span>
                  </div>
                  <div className="w-full h-6 bg-surface-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary */}
        <div>
          <h2 className="type-eyebrow text-accent mb-3">
            Primary Strengths
          </h2>
          <div className="grid gap-4">
            {scores.slice(0, 2).map((score) => (
              <GiftCard key={score.category_id} score={score} showNextStep />
            ))}
          </div>
        </div>

        {/* Secondary */}
        <div>
          <h2 className="type-eyebrow text-muted-foreground mb-3">
            Secondary Strengths
          </h2>
          <div className="grid gap-4">
            {scores.slice(2, 5).map((score) => (
              <GiftCard key={score.category_id} score={score} showNextStep />
            ))}
          </div>
        </div>

        {/* Middle */}
        <div>
          <h2 className="type-eyebrow text-faint-foreground mb-3">
            Middle Range
          </h2>
          <div className="grid gap-4">
            {scores.slice(5, -2).map((score) => (
              <GiftCard key={score.category_id} score={score} startCollapsed />
            ))}
          </div>
        </div>

        {/* Lower */}
        <div>
          <h2 className="type-eyebrow text-faint-foreground mb-3">
            Lower-Energy Areas
          </h2>
          <div className="grid gap-4">
            {scores.slice(-2).map((score) => (
              <GiftCard key={score.category_id} score={score} startCollapsed />
            ))}
          </div>
        </div>

        {/* What next */}
        <div className="bg-surface-subtle rounded-card border border-border p-6">
          <h3 className="type-h3 text-foreground mb-2">What Next?</h3>
          <p className="type-small text-muted-foreground">
            This assessment is descriptive, not definitive. Spiritual maturity, character, and
            local church affirmation matter more than self-perception alone. Share these results
            with your pastor, small group leader, or mentor and discuss how your gifts can be
            put to use in the life of the church.
          </p>
        </div>

        {/* Confirm in community CTA */}
        <a
          href="/confirm"
          className="block w-full py-3.5 bg-accent text-accent-foreground rounded-card text-base font-semibold text-center shadow-card hover:bg-accent-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Next: confirm your gifts in community →
        </a>

        {/* Share & Invite */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={async () => {
              const top2 = scores.slice(0, 2).map((s) => s.public_name).join(" and ");
              const url = window.location.href;
              const text = `I just took the Charismata spiritual gifts assessment! My top gifts are ${top2}. See my full results:`;
              if (navigator.share) {
                try {
                  await navigator.share({ text, url });
                } catch { /* cancelled */ }
              } else {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                alert("Link copied to clipboard!");
              }
            }}
            className="py-3 bg-foreground text-background rounded-md text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Share Your Results
          </button>
          <button
            onClick={async () => {
              const params = new URLSearchParams();
              if (churchName) params.set("church", churchName);
              if (groupName) params.set("group", groupName);
              const qs = params.toString();
              const inviteUrl = `${window.location.origin}/${qs ? `?${qs}` : ""}`;
              const text = "Take the Charismata spiritual gifts assessment and discover how God has equipped you for service!";
              if (navigator.share) {
                try {
                  await navigator.share({ text, url: inviteUrl });
                } catch { /* cancelled */ }
              } else {
                await navigator.clipboard.writeText(`${text}\n${inviteUrl}`);
                alert("Invite link copied to clipboard!");
              }
            }}
            className="py-3 bg-surface text-foreground border border-border-strong rounded-md text-sm font-semibold hover:bg-surface-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Invite Someone
          </button>
        </div>

        <div className="text-center">
          <a href="/resources" className="type-small text-accent hover:text-accent-hover font-medium transition-colors">
            Explore the glossary and theological framework →
          </a>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="type-small text-muted-foreground hover:text-foreground transition-colors"
          >
            Take another assessment
          </a>
        </div>
      </main>
    );
  }

  // ─── Questionnaire ───────────────────────────────
  const isLastPage = currentPage === totalPages - 1;
  const pageAnswered = pageQuestions.filter((q) => responses[q.question_id] !== undefined).length;
  const pageComplete = pageAnswered === pageQuestions.length;
  const allAnswered = answeredCount === totalCount;

  return (
    <main className="max-w-2xl mx-auto px-4 py-4">
      {/* Progress */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="type-small text-muted-foreground">
            {currentPage * QUESTIONS_PER_PAGE + 1}–
            {Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, totalCount)} of {totalCount}
          </span>
          <span className="type-small font-medium text-foreground">{progressPct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assessment progress"
          className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const ps = i * QUESTIONS_PER_PAGE;
            const pe = Math.min((i + 1) * QUESTIONS_PER_PAGE, totalCount);
            const pqs = questions.slice(ps, pe);
            const allDone = pqs.every((q) => responses[q.question_id] !== undefined);

            return (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                aria-label={`Go to page ${i + 1}${allDone ? ", complete" : ", incomplete"}${i === currentPage ? ", current" : ""}`}
                aria-current={i === currentPage ? "step" : undefined}
                className="min-w-[24px] min-h-[24px] inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentPage
                      ? "bg-accent-strong scale-150"
                      : allDone
                      ? "bg-accent"
                      : "bg-faint-foreground"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mt-2">
        {pageQuestions.map((q, qIdx) => {
          const globalIdx = currentPage * QUESTIONS_PER_PAGE + qIdx + 1;
          const selectedValue = responses[q.question_id];

          return (
            <div
              key={q.question_id}
              className={`bg-surface rounded-card p-5 shadow-card transition-shadow ${
                selectedValue !== undefined
                  ? "border border-border"
                  : "border border-border-strong"
              }`}
            >
              <p id={`q-${q.question_id}`} className="type-body text-foreground mb-4">
                <span className="text-faint-foreground font-medium mr-2">{globalIdx}.</span>
                {q.question_text}
              </p>

              <div
                role="group"
                aria-labelledby={`q-${q.question_id}`}
                className="flex items-center justify-between gap-1.5"
              >
                {SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleResponse(q.question_id, opt.value)}
                    aria-pressed={selectedValue === opt.value}
                    aria-label={opt.label}
                    className={`flex-1 min-h-[40px] py-2.5 rounded-md text-xs sm:text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                      selectedValue === opt.value
                        ? "bg-accent text-accent-foreground shadow-xs"
                        : "bg-surface-subtle text-muted-foreground border border-border hover:bg-accent-subtle hover:text-accent-strong hover:border-accent-subtle"
                    }`}
                  >
                    <span className="hidden sm:inline">{opt.label}</span>
                    <span className="sm:hidden">{opt.short}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 type-small text-red-700"
        >
          {error}
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2.5 text-sm font-medium text-foreground bg-surface border border-border-strong rounded-md hover:bg-surface-subtle disabled:opacity-30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Previous
        </button>

        {isLastPage ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="px-6 py-2.5 text-sm font-semibold text-accent-foreground bg-accent rounded-md shadow-card hover:bg-accent-hover disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {submitting
              ? "Submitting..."
              : allAnswered
              ? "Submit Assessment"
              : `${totalCount - answeredCount} unanswered`}
          </button>
        ) : (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              pageComplete
                ? "bg-accent text-accent-foreground shadow-card hover:bg-accent-hover"
                : "bg-surface text-foreground border border-border-strong hover:bg-surface-subtle"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}

// ─── Gift Card ─────────────────────────────────────

function GiftCard({
  score,
  startCollapsed = false,
  showNextStep = false,
}: {
  score: ScoreWithCategory;
  startCollapsed?: boolean;
  showNextStep?: boolean;
}) {
  const [expanded, setExpanded] = useState(!startCollapsed);
  const nextStep = showNextStep ? GIFT_NEXT_STEPS[score.public_name] : undefined;

  return (
    <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        <h3 className="type-h3 text-foreground">{score.public_name}</h3>
        <svg
          className={`w-5 h-5 text-accent shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {score.description && (
            <p className="type-small text-muted-foreground">{score.description}</p>
          )}

          {score.strengths && (
            <div>
              <h4 className="type-eyebrow text-accent mb-1">
                Strengths & Contributions
              </h4>
              <p className="type-small text-muted-foreground">{score.strengths}</p>
            </div>
          )}

          {score.cautions && (
            <div>
              <h4 className="type-eyebrow text-amber-700 mb-1">
                Watch-Outs
              </h4>
              <p className="type-small text-muted-foreground">{score.cautions}</p>
            </div>
          )}

          {score.ministry_fit && (
            <div>
              <h4 className="type-eyebrow text-muted-foreground mb-1">
                Possible Ministry Fit
              </h4>
              <p className="type-small text-muted-foreground">{score.ministry_fit}</p>
            </div>
          )}

          {nextStep && (
            <div className="mt-2 rounded-lg bg-accent-subtle p-4 space-y-3">
              <div>
                <h5 className="type-eyebrow text-accent-strong mb-1">
                  Reflect
                </h5>
                <ul className="space-y-1">
                  {nextStep.reflect.map((item, i) => (
                    <li key={i} className="type-caption text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="type-eyebrow text-accent-strong mb-1">
                  This week
                </h5>
                <ul className="space-y-1">
                  {nextStep.steps.map((item, i) => (
                    <li key={i} className="type-caption text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="type-eyebrow text-accent-strong mb-1">
                  Sit with
                </h5>
                <p className="type-caption text-muted-foreground italic">
                  {nextStep.scripture}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
