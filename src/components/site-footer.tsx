export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[rgba(233,223,201,0.9)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--color-ink)]">DEADPOET</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
            Vintage-inspired poetry and storytelling in Marathi, Hindi, and English.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-right md:text-left">
          <p>© {new Date().getFullYear()} DEADPOET. All rights reserved.</p>
          <p>Crafted with ink, paper, and a little sepia-toned nostalgia.</p>
        </div>
      </div>
    </footer>
  );
}
