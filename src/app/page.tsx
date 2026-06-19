"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [church, setChurch] = useState("");
  const [group, setGroup] = useState("");
  const [starting, setStarting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const c = searchParams.get("church");
    const g = searchParams.get("group");
    if (c) setChurch(c);
    if (g) setGroup(g);
    if (c || g) setShowInfo(true);
  }, [searchParams]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_name: name.trim() || null,
          participant_email: email.trim() || null,
          church_name: church.trim() || null,
          group_name: group.trim() || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/assessment/${data.sessionId}`);
      }
    } catch {
      // error
    } finally {
      setStarting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-12 sm:py-20">
      {/* Masthead */}
      <header className="text-center mb-12 sm:mb-14">
        <p className="type-eyebrow text-accent mb-4">Spiritual Gifts Assessment</p>
        <h1 className="type-display text-foreground">Charismata</h1>
        <p className="type-body sm:text-lg text-muted-foreground mt-4 max-w-md mx-auto text-balance">
          Discover how God has equipped you for service in His church
        </p>
      </header>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-surface rounded-card border border-border shadow-card p-6 space-y-4">
          <p className="type-body text-muted-foreground">
            This assessment contains <strong className="font-semibold text-foreground">100 statements</strong> about behaviors, tendencies, and
            preferences. For each one, indicate how strongly you agree or disagree based on{" "}
            <em>what is typically true of you</em> — not what you wish were true or think should be true.
          </p>
          <p className="type-body text-muted-foreground">
            There are no right or wrong answers. This tool offers{" "}
            <strong className="font-semibold text-foreground">directional insight</strong> — your results should be considered alongside
            community affirmation and the observable fruit in your life and ministry.
          </p>
          <p className="type-small text-faint-foreground">
            Approximately <strong className="font-semibold text-muted-foreground">15–20 minutes</strong>. Your progress saves automatically.
          </p>
        </div>

        {/* Scale */}
        <div className="bg-surface-subtle rounded-card border border-border p-5">
          <p className="type-eyebrow text-muted-foreground mb-3">
            Response Scale
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {["Strongly\nDisagree", "Disagree", "Neutral", "Agree", "Strongly\nAgree"].map(
              (label, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="w-9 h-9 rounded-full bg-surface border border-border-strong flex items-center justify-center mx-auto font-semibold text-muted-foreground">
                    {i + 1}
                  </div>
                  <p className="text-faint-foreground whitespace-pre-line leading-tight">{label}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Optional info */}
        <div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 type-small text-muted-foreground hover:text-foreground transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showInfo ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Optional: Add your name and info
          </button>

          {showInfo && (
            <div className="mt-3 bg-surface rounded-card border border-border shadow-card p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block type-caption font-medium text-muted-foreground mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 border border-border-strong rounded-md text-base bg-surface placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block type-caption font-medium text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-3 py-2.5 border border-border-strong rounded-md text-base bg-surface placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-shadow"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block type-caption font-medium text-muted-foreground mb-1.5">Church</label>
                  <input
                    type="text"
                    value={church}
                    onChange={(e) => setChurch(e.target.value)}
                    placeholder="Church name"
                    className="w-full px-3 py-2.5 border border-border-strong rounded-md text-base bg-surface placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block type-caption font-medium text-muted-foreground mb-1.5">Group</label>
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="Small group, team, etc."
                    className="w-full px-3 py-2.5 border border-border-strong rounded-md text-base bg-surface placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-shadow"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full py-4 bg-accent text-accent-foreground rounded-card text-base font-semibold shadow-card hover:bg-accent-hover disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {starting ? "Preparing your assessment..." : "Begin Assessment"}
        </button>

        {/* Disclaimer */}
        <p className="type-caption text-faint-foreground text-center max-w-md mx-auto text-balance">
          This assessment is descriptive, not definitive. Spiritual maturity, character, and local
          church affirmation matter more than self-perception alone.
        </p>

        {/* Legal links */}
        <div className="flex justify-center gap-3 pt-2">
          <a
            href="/terms"
            className="type-caption text-faint-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <span className="type-caption text-border-strong">&middot;</span>
          <a
            href="/privacy"
            className="type-caption text-faint-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </main>
  );
}
