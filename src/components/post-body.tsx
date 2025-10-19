import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import type { Language, PostType } from '@/generated/prisma';
import { getBodyFontClass } from '@/lib/typography';

type PostBodyProps = {
  content: string;
  language: Language;
  type: PostType;
};

export function PostBody({ content, language, type }: PostBodyProps) {
  const fontClass = getBodyFontClass(language);
  const isPoem = type === 'poem';

  const wrapperClass = ['max-w-none text-black', fontClass, isPoem ? 'poem-formatting' : 'article-body']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p(props) {
            const className = [
              'leading-7 text-black',
              fontClass,
              isPoem ? 'whitespace-pre-wrap text-base leading-7' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return <p {...props} className={className} />;
          },
          h2(props) {
            return <h2 {...props} className={['mt-10 font-heading-english text-3xl font-bold', fontClass].join(' ')} />;
          },
          h3(props) {
            return <h3 {...props} className={['mt-8 font-heading-english text-2xl font-bold', fontClass].join(' ')} />;
          },
          li(props) {
            return <li {...props} className={['ml-4 list-disc pb-1', fontClass].join(' ')} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
