"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  // Hide nav on assessment pages and admin pages
  if (pathname?.startsWith("/assessment") || pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isResources =
    pathname === "/resources" ||
    pathname === "/terms" ||
    pathname === "/privacy";

  const linkBase =
    "text-sm transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-12">
        <Link
          href="/"
          className="text-base font-semibold text-foreground tracking-tight rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Charismata
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`${linkBase} ${
              isHome
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Assessment
          </Link>
          <Link
            href="/resources"
            className={`${linkBase} ${
              isResources
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Resources
          </Link>
          <a
            href="mailto:matt@mattheerema.com?subject=Charismata%20Feedback"
            className={`${linkBase} text-muted-foreground hover:text-foreground`}
          >
            Feedback
          </a>
        </div>
      </div>
    </nav>
  );
}
