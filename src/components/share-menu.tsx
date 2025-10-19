'use client';

import { useState } from 'react';
import type { ShareNetwork } from '@/generated/prisma';
import { logShare } from '@/actions/shares';

const networks: Array<{ id: ShareNetwork; label: string }> = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' },
];

export function ShareMenu({
  postId,
  postTitle,
  shareUrl,
  initialCount,
}: {
  postId: string;
  postTitle: string;
  shareUrl: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const onShare = async (network: ShareNetwork) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(postTitle);
    let targetUrl = '';

    switch (network) {
      case 'whatsapp':
        targetUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'twitter':
        targetUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        targetUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'copy':
        break;
      default:
        break;
    }

    if (network === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopyStatus('Link copied!');
        await logShare(postId, 'copy');
        setCount((prev) => prev + 1);
        setTimeout(() => setCopyStatus(null), 1500);
      } catch {
        setCopyStatus('Copy failed');
        setTimeout(() => setCopyStatus(null), 1500);
      }
      return;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    await logShare(postId, network);
    setCount((prev) => prev + 1);
  };

  const tryNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: postTitle,
          url: shareUrl,
        });
        await logShare(postId, 'copy');
        setCount((prev) => prev + 1);
        return;
      } catch {
        // fall through to buttons below
      }
    }
    setCopyStatus('Use the buttons below to share');
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={tryNativeShare}
        className="inline-flex items-center gap-2 border-2 border-black bg-[var(--color-accent-primary)] px-4 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
      >
        Share • {count}
      </button>
      <div className="flex flex-wrap items-center gap-2">
        {networks.map((network) => (
          <button
            type="button"
            key={network.id}
            onClick={() => onShare(network.id)}
            className="border-2 border-black bg-[var(--color-accent-tertiary)] px-3 py-1.5 text-xs font-medium uppercase text-black transition-all hover:bg-[var(--color-accent-primary)] hover:text-black"
          >
            {network.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onShare('copy')}
          className="border-2 border-black bg-[var(--color-accent-success)] px-4 py-1.5 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
        >
          Copy Link
        </button>
      </div>
      {copyStatus ? <p className="border-2 border-black bg-[var(--color-accent-success)] px-3 py-2 text-xs font-medium text-black">{copyStatus}</p> : null}
    </div>
  );
}
