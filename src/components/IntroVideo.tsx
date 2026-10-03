'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { site } from '@/content/data';

/**
 * Hero self-intro. A short muted preview loops in the card (browsers only allow
 * silent autoplay); "Watch my intro" opens the full video with sound in a dialog.
 * Without `site.introVideo` the card simply shows the photo.
 */
export function IntroVideo() {
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const video = site.introVideo;

  const open = () => {
    dialog.current?.showModal();
    const v = full.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const close = () => dialog.current?.close();

  if (!video) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
        <Image src={site.photo} alt={`Portrait of ${site.name}`} fill priority sizes="(max-width: 1024px) 340px, 420px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[20px] text-left"
        aria-label={`Watch ${site.name}'s video introduction${site.introLength ? ` (${site.introLength})` : ''}`}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          src={site.introPreview || video}
          poster={site.photo}
          muted
          loop
          playsInline
          autoPlay={!reduce}
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20" />
        <span className="glass-dense absolute top-4 left-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
          <span className="h-2 w-2 rounded-full bg-[var(--coral)]" /> Hi, I&apos;m {site.name}
        </span>
        <span className="absolute inset-x-4 bottom-4 flex items-center gap-4">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#06110f] transition-transform duration-500 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.4s]" />
            <svg viewBox="0 0 24 24" className="relative ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className="grid text-white">
            <b className="text-[17px]">Watch my intro</b>
            {site.introLength && <span className="text-sm text-white/75">{site.introLength} · with sound</span>}
          </span>
        </span>
      </button>

      <dialog
        ref={dialog}
        onClose={() => full.current?.pause()}
        onClick={(e) => e.target === dialog.current && close()}
        className="intro-dialog m-auto max-h-[92svh] w-[min(92vw,1100px)] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-md"
        aria-label={`${site.name} introduction video`}
      >
        <div className="relative mx-auto w-fit max-w-full">
          <video ref={full} src={video} poster={site.photo} controls playsInline preload="none" className="mx-auto max-h-[86svh] w-auto max-w-full rounded-3xl bg-black">
            {site.introCaptions && <track kind="captions" src={site.introCaptions} srcLang="en" label="English" default />}
          </video>
          <button
            type="button"
            onClick={close}
            className="glass-dense absolute -top-4 -right-4 grid h-11 w-11 place-items-center rounded-full text-xl text-white max-sm:top-2 max-sm:right-2"
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      </dialog>
    </>
  );
}
