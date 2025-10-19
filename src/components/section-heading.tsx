import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  description?: ReactNode;
};

export function SectionHeading({ title, eyebrow, actions, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 border-b-2 border-black pb-5 md:flex-row md:items-start md:justify-between">
      <div className="flex-1">
        {eyebrow ? (
          <span className="inline-block border-2 border-black bg-[var(--color-accent-tertiary)] px-2.5 py-1 text-xs font-bold uppercase text-black">{eyebrow}</span>
        ) : null}
        <h2 className="mt-3 text-2xl font-bold text-black md:text-3xl">{title}</h2>
        {description ? (
          <div className="mt-2 text-sm leading-relaxed text-black">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="mt-3 md:mt-0">{actions}</div> : null}
    </div>
  );
}
