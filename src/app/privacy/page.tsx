import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Charismata",
  description: "Privacy Policy for the Charismata spiritual gifts assessment",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="type-h1 text-foreground">
          Privacy Policy
        </h1>
        <p className="type-small text-muted-foreground mt-2">
          Effective March 16, 2026
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Introduction
          </h2>
          <p className="type-body text-muted-foreground">
            This Privacy Policy describes how Charismata (charismata.org) collects, uses,
            and protects your information. The Service is operated by Matt Heerema. I take
            your privacy seriously and aim to collect only what is necessary to deliver the
            assessment experience.
          </p>
        </section>

        {/* What We Collect */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            What We Collect
          </h2>
          <p className="type-body text-muted-foreground">
            When you take the assessment, the following data may be collected:
          </p>
          <ul className="type-body text-muted-foreground list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong>Name</strong> &mdash; optional, only if you choose to provide it
            </li>
            <li>
              <strong>Email address</strong> &mdash; optional, only if you choose to
              provide it
            </li>
            <li>
              <strong>Church name</strong> &mdash; optional, only if you choose to provide
              it
            </li>
            <li>
              <strong>Group name</strong> &mdash; optional, only if you choose to provide
              it
            </li>
            <li>
              <strong>Assessment responses</strong> &mdash; your answers to 100 statements
              on a 1&ndash;5 scale
            </li>
            <li>
              <strong>Calculated scores</strong> &mdash; your results across 10 gift
              categories, derived from your responses
            </li>
          </ul>
          <p className="type-body text-muted-foreground">
            If your session was provisioned by a third-party integration (such as Trellis),
            your name and email may be provided by that service rather than entered by you
            directly.
          </p>
        </section>

        {/* How We Use Your Data */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            How We Use Your Data
          </h2>
          <p className="type-body text-muted-foreground">
            Your data is used to:
          </p>
          <ul className="type-body text-muted-foreground list-disc list-inside space-y-1.5 ml-1">
            <li>Generate and display your assessment results</li>
            <li>Allow you to return to your results via your session link</li>
            <li>
              Improve the assessment through aggregate, anonymized analysis of response
              patterns
            </li>
          </ul>
        </section>

        {/* What We Don't Do */}
        <section className="bg-surface-subtle rounded-card border border-border p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            What We Don&apos;t Do
          </h2>
          <ul className="type-body text-muted-foreground list-disc list-inside space-y-1.5 ml-1">
            <li>We do not sell your data to anyone, ever</li>
            <li>We do not use advertising or ad-tracking services</li>
            <li>We do not use analytics or tracking cookies</li>
            <li>
              We do not share your data with third parties, except as described below
            </li>
          </ul>
        </section>

        {/* Third-Party Integrations */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Third-Party Integrations
          </h2>
          <p className="type-body text-muted-foreground">
            If your assessment session was provisioned through a third-party application
            (such as Trellis), your results will be sent back to that service via a secure
            callback as part of the integration your organization opted into. In that case,
            the third party&apos;s own privacy policy governs how they handle your data
            once received.
          </p>
          <p className="type-body text-muted-foreground">
            Outside of this specific scenario, your data is never shared with any third
            party.
          </p>
        </section>

        {/* Cookies */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Cookies
          </h2>
          <p className="type-body text-muted-foreground">
            Charismata does not use tracking cookies, analytics cookies, or advertising
            cookies. The only cookie used is a functional authentication cookie for the
            administrative panel, which does not affect regular users of the assessment.
          </p>
        </section>

        {/* Data Storage and Security */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Data Storage and Security
          </h2>
          <p className="type-body text-muted-foreground">
            Your data is stored in a PostgreSQL database hosted by Neon in the United
            States. The application is hosted on Vercel, also in the United States.
          </p>
          <p className="type-body text-muted-foreground">
            All data is encrypted in transit using HTTPS/TLS. Database connections use SSL.
            While no system is perfectly secure, I take reasonable measures to protect your
            information.
          </p>
        </section>

        {/* Data Retention and Deletion */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Data Retention and Deletion
          </h2>
          <p className="type-body text-muted-foreground">
            Assessment data is retained indefinitely to allow you to access your results at
            any time. If you would like your data deleted, you may request deletion by
            emailing{" "}
            <a
              href="mailto:matt@mattheerema.com"
              className="text-accent underline hover:text-accent-hover transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              matt@mattheerema.com
            </a>
            . I will delete all data associated with your session upon request.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Children&apos;s Privacy
          </h2>
          <p className="type-body text-muted-foreground">
            Charismata is intended for users aged 13 and older. The Service does not
            knowingly collect personal information from children under 13, in compliance
            with COPPA (Children&apos;s Online Privacy Protection Act).
          </p>
          <p className="type-body text-muted-foreground">
            For users between 13 and 16, parental consent is recommended, particularly in a
            church or youth group context. If you believe a child under 13 has provided
            personal information through the Service, please contact me at{" "}
            <a
              href="mailto:matt@mattheerema.com"
              className="text-accent underline hover:text-accent-hover transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              matt@mattheerema.com
            </a>{" "}
            and I will promptly delete that data.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Changes to This Policy
          </h2>
          <p className="type-body text-muted-foreground">
            I may update this Privacy Policy from time to time. Changes will be reflected on
            this page with an updated effective date. Continued use of the Service after
            changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-surface-subtle rounded-card border border-border p-6 space-y-3">
          <h2 className="type-eyebrow text-accent">
            Contact
          </h2>
          <p className="type-body text-muted-foreground">
            If you have questions about this Privacy Policy or want to request data
            deletion, you can reach me at{" "}
            <a
              href="mailto:matt@mattheerema.com"
              className="text-accent underline hover:text-accent-hover transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              matt@mattheerema.com
            </a>
            .
          </p>
          <p className="type-small text-faint-foreground">
            Matt Heerema<br />
            2916 Bayberry Rd.<br />
            Ames, IA 50014
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border text-center space-y-2">
        <div className="flex justify-center gap-4">
          <Link
            href="/terms"
            className="type-small text-muted-foreground hover:text-accent transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Terms of Service
          </Link>
          <span className="text-border-strong">|</span>
          <Link
            href="/resources"
            className="type-small text-muted-foreground hover:text-accent transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Resources
          </Link>
        </div>
      </div>
    </main>
  );
}
