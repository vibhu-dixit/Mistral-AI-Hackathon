import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-rw-border bg-rw-bg/80 backdrop-blur">
      <div className="h-0.5 bg-gradient-to-r from-rw-brand-start via-rw-brand-end to-rw-accent-navy" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-rw-brand-start to-rw-brand-end bg-clip-text text-sm font-bold tracking-tight text-transparent"
        >
          RoadWatch
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-rw-text-muted">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-rw-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
