import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About DEADPOET',
  description: 'Author biography, writing ethos, and the inspiration behind DEADPOET.',
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="border-2 border-black bg-white px-8 py-12 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:px-14 md:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <Link 
            href="https://github.com/bhushcodes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex h-48 w-48 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-black transition-all hover:border-[6px]"
          >
            <Image
              src="https://github.com/bhushcodes.png"
              alt="bhushcodes GitHub Profile"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[var(--color-accent-primary)] opacity-0 transition-opacity group-hover:opacity-20" />
          </Link>
          <div className="space-y-6 text-black">
            <h1 className="text-4xl font-bold">नमस्कार | नमस्ते | Hello</h1>
            <p className="text-lg leading-relaxed text-black">
              I am DEADPOET—a poet, storyteller, and keeper of carefully aged words. DEADPOET is
              my personal library of original Marathi, Hindi, and English writings. Each piece is born
              in its own language; none are translations. Think of this space as a vintage desk with
              ink-stained pages, where I experiment with form, rhythm, and memory.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-2 border-black bg-white p-4">
                <h2 className="text-xl font-bold text-black">Literary focus</h2>
                <ul className="mt-3 space-y-2 text-sm text-black">
                  <li>• Contemporary and neo-classical Marathi poetry</li>
                  <li>• Hindi micro-fiction with cinematic beats</li>
                  <li>• English prose-poems exploring nostalgia and identity</li>
                </ul>
              </div>
              <div className="border-2 border-black bg-white p-4">
                <h2 className="text-xl font-bold text-black">Design ethos</h2>
                <ul className="mt-3 space-y-2 text-sm text-black">
                  <li>• Hand-crafted typography with language-specific fonts</li>
                  <li>• Clean neobrutalist design with stark black and white</li>
                  <li>• Bold interactions with clear visual hierarchy</li>
                </ul>
              </div>
            </div>
            <p className="text-sm font-medium uppercase tracking-wide text-black">
              Stay awhile, explore the archives, and feel free to share a poem that moves you.
            </p>
          </div>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-bold text-black">Timeline</h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-black">
          <p><strong>2015</strong> — Began performing at Marathi and Hindi poetry circles.</p>
          <p><strong>2018</strong> — Published the first zine with bilingual poems.</p>
          <p><strong>2021</strong> — Launched DEADPOET to archive my multi-language work.</p>
          <p><strong>Today</strong> — Expanding the archive with vintage design, reader likes, and community-led sharing.</p>
        </div>
      </section>
    </div>
  );
}
