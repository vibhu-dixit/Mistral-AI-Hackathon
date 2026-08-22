import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/dashboard", label: "Dashboard" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-rw-border bg-rw-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-rw-text">
          RoadWatch
        </Link>
        <nav className="flex gap-6 text-sm text-rw-text-muted">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-rw-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
