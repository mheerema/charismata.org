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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-stone-200 border-t-stone-600 rounded-full" />
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────
  if (status === "submitted" && scores.length > 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">Your Results</h1>
          {participantName && <p className="text-stone-500 mt-1">{participantName}</p>}
        </div>

        {/* Results-interpretation callout */}
        <div className="bg-stone-100/60 rounded-2xl border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-2">
            {RESULTS_CALLOUT.heading}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {RESULTS_CALLOUT.segments.map((seg, i) => (
              <span key={i}>
                {seg.bold && (
                  <strong className="font-semibold text-stone-800">{seg.bold}</strong>
                )}
                {seg.text}
              </span>
            ))}
          </p>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="space-y-3">
            {scores.map((score) => {
              const maxScore = 50;
              const widthPct = Math.round((score.raw_score / maxScore) * 100);
              const isTop2 = score.rank <= 2;
              const isBottom2 = score.rank >= scores.length - 1;

              return (
                <div key={score.category_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isTop2 ? "text-stone-900" : "text-stone-500"}`}>
                      {score.public_name}
                    </span>
                  </div>
                  <div className="w-full h-6 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTop2 ? "bg-stone-800" : isBottom2 ? "bg-stone-300" : "bg-stone-500"
                      }`}
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
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
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
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
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
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
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
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Lower-Energy Areas
          </h2>
          <div className="grid gap-4">
            {scores.slice(-2).map((score) => (
              <GiftCard key={score.category_id} score={score} startCollapsed />
            ))}
          </div>
        </div>

        {/* What next */}
        <div className="bg-stone-100/60 rounded-2xl border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-2">What Next?</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            This assessment is descriptive, not definitive. Spiritual maturity, character, and
            local church affirmation matter more than self-perception alone. Share these results
            with your pastor, small group leader, or mentor and discuss how your gifts can be
            put to use in the life of the church.
          </p>
        </div>

        {/* Confirm in community CTA */}
        <a
          href="/confirm"
          className="block w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold text-center hover:bg-stone-800 transition-colors"
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
            className="py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors"
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
            className="py-3 bg-white text-stone-700 border border-stone-300 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors"
          >
            Invite Someone
          </button>
        </div>

        <div className="text-center">
          <a href="/resources" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            Explore the glossary and theological framework →
          </a>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
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
      <div className="sticky top-0 bg-[#fafaf9]/95 backdrop-blur-sm z-10 pb-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-500">
            {currentPage * QUESTIONS_PER_PAGE + 1}–
            {Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, totalCount)} of {totalCount}
          </span>
          <span className="text-sm font-medium text-stone-700">{progressPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-700 rounded-full transition-all duration-300"
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
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage
                    ? "bg-stone-800 scale-150"
                    : allDone
                    ? "bg-stone-500"
                    : "bg-stone-300"
                }`}
              />
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
              className={`bg-white rounded-xl border-2 p-5 transition-colors ${
                selectedValue !== undefined ? "border-stone-200" : "border-stone-300"
              }`}
            >
              <p className="text-sm text-stone-800 mb-4 leading-relaxed">
                <span className="text-stone-400 font-medium mr-2">{globalIdx}.</span>
                {q.question_text}
              </p>

              <div className="flex items-center justify-between gap-1">
                {SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleResponse(q.question_id, opt.value)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      selectedValue === opt.value
                        ? "bg-stone-800 text-white shadow-sm"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
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
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 disabled:opacity-30"
        >
          Previous
        </button>

        {isLastPage ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors"
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
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              pageComplete
                ? "bg-stone-900 text-white hover:bg-stone-800"
                : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
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
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
      >
        <h3 className="text-base font-semibold text-stone-900">{score.public_name}</h3>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-stone-100 pt-4">
          {score.description && (
            <p className="text-sm text-stone-600 leading-relaxed">{score.description}</p>
          )}

          {score.strengths && (
            <div>
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Strengths & Contributions
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">{score.strengths}</p>
            </div>
          )}

          {score.cautions && (
            <div>
              <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Watch-Outs
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">{score.cautions}</p>
            </div>
          )}

          {score.ministry_fit && (
            <div>
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Possible Ministry Fit
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">{score.ministry_fit}</p>
            </div>
          )}

          {nextStep && (
            <div className="mt-2 rounded-xl bg-stone-50 border border-stone-100 p-4 space-y-3">
              <div>
                <h5 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Reflect
                </h5>
                <ul className="space-y-1">
                  {nextStep.reflect.map((item, i) => (
                    <li key={i} className="text-xs text-stone-500 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  This week
                </h5>
                <ul className="space-y-1">
                  {nextStep.steps.map((item, i) => (
                    <li key={i} className="text-xs text-stone-500 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Sit with
                </h5>
                <p className="text-xs text-stone-500 leading-relaxed">
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
