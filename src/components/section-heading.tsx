import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  description?: ReactNode;
};

export function SectionHeading({ title, eyebrow, actions, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-black/10 pb-4 md:flex-row md:items-center md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 font-serif text-3xl text-[var(--color-ink)]">{title}</h2>
        {description ? (
          <div className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="mt-2 md:mt-0">{actions}</div> : null}
    </div>
  );
}
