"use client";

import { CONFIRM_CONTENT } from "@/lib/gift-content";

export default function ConfirmPage() {
  const c = CONFIRM_CONTENT;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {c.pageTitle}
        </h1>
        <p className="text-stone-500 mt-2 text-base italic">{c.subtitle}</p>
      </div>

      {/* Print button — hidden on the printed page */}
      <div className="flex justify-center mb-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
        >
          Print this page
        </button>
      </div>

      <div className="space-y-8">
        {/* Intro */}
        <div className="bg-stone-100/60 rounded-2xl border border-stone-200 p-5">
          <p className="text-sm text-stone-600 leading-relaxed">{c.intro}</p>
        </div>

        {/* How to use */}
        <div>
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            How to use this
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">{c.howToUse}</p>
        </div>

        {/* The three prompts */}
        <div>
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            The three prompts
          </h2>
          <p className="text-xs text-stone-400 mb-3">
            Use these three questions for each of your top gifts. Bring them
            verbatim if it helps.
          </p>
          <div className="space-y-4">
            {c.prompts.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 p-5"
              >
                <h3 className="text-sm font-semibold text-stone-800">
                  {i + 1}. {p.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-4">
                  {p.quote}
                </p>
                {p.note && (
                  <p className="mt-3 text-sm text-stone-500 italic leading-relaxed">
                    {p.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Escape hatch — visually set apart */}
        <div className="bg-stone-800 rounded-2xl p-6 text-stone-100">
          <p className="text-sm font-semibold leading-relaxed">
            {c.bodyCanName.prompt}
          </p>
          <p className="mt-3 text-base leading-relaxed border-l-2 border-stone-500 pl-4">
            {c.bodyCanName.question}
          </p>
          <p className="mt-4 text-sm text-stone-300 leading-relaxed">
            {c.bodyCanName.body}
          </p>
        </div>

        {/* Affirmations closing line */}
        <p className="text-sm text-stone-500 italic leading-relaxed text-center">
          {c.affirmationsNote}
        </p>
      </div>

      {/* Back link */}
      <div className="text-center mt-10 print:hidden">
        <a
          href="/"
          className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}
