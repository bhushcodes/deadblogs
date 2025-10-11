export const metadata = {
  title: 'About DEADPOET',
  description: 'Author biography, writing ethos, and the inspiration behind DEADPOET.',
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.7)] px-8 py-12 shadow-[var(--shadow-card)] md:px-14 md:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[radial-gradient(circle_at_30%_30%,rgba(123,63,75,0.18),transparent_60%),rgba(233,223,201,0.7)] shadow-[var(--shadow-card)]">
            <span className="font-serif text-3xl uppercase tracking-[0.6em] text-[var(--color-ink)]">DP</span>
          </div>
          <div className="space-y-6 text-[var(--color-ink)]">
            <h1 className="font-serif text-4xl">नमस्कार | नमस्ते | Hello</h1>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              I am DEADPOET—a poet, storyteller, and keeper of carefully aged words. DEADPOET is
              my personal library of original Marathi, Hindi, and English writings. Each piece is born
              in its own language; none are translations. Think of this space as a vintage desk with
              ink-stained pages, where I experiment with form, rhythm, and memory.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-4">
                <h2 className="font-serif text-xl text-[var(--color-ink)]">Literary focus</h2>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
                  <li>• Contemporary and neo-classical Marathi poetry</li>
                  <li>• Hindi micro-fiction with cinematic beats</li>
                  <li>• English prose-poems exploring nostalgia and identity</li>
                </ul>
              </div>
              <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-4">
                <h2 className="font-serif text-xl text-[var(--color-ink)]">Vintage ethos</h2>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
                  <li>• Hand-crafted typography with language-specific fonts</li>
                  <li>• Parchment textures, muted inks, and classic drop caps</li>
                  <li>• Gentle interactions—never overwhelming or flashy</li>
                </ul>
              </div>
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Stay awhile, explore the archives, and feel free to share a poem that moves you.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-8 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Timeline</h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-[var(--color-muted)]">
          <p><strong>2015</strong> — Began performing at Marathi and Hindi poetry circles.</p>
          <p><strong>2018</strong> — Published the first zine with bilingual poems.</p>
          <p><strong>2021</strong> — Launched DEADPOET to archive my multi-language work.</p>
          <p><strong>Today</strong> — Expanding the archive with vintage design, reader likes, and community-led sharing.</p>
        </div>
      </section>
    </div>
  );
}
