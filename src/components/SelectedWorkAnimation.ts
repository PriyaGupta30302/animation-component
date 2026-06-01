'use client';

import { RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSelectedWorkAnimation(containerRef: RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Header entrance animations
    gsap.fromTo('.heading-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.2 }
    );

    // 2. Setup dynamic ScrollTriggers for all project containers
    const cards = gsap.utils.toArray('.project-card');
    if (cards.length === 0) return;

    const wrappers = cards.map((card: any) => card.querySelector('.project-image-wrapper'));
    const thumbnails = document.querySelectorAll('.header-thumbnail');
    const buttons = cards.map((card: any) => card.querySelector('.view-project-btn'));

    // Set initial states
    wrappers.forEach((wrapper: any, idx: number) => {
      if (!wrapper) return;
      if (idx === 0) {
        gsap.set(wrapper, { width: '40%', marginLeft: '0', marginRight: 'auto' });
      } else {
        gsap.set(wrapper, { width: '0%', marginLeft: '0', marginRight: 'auto' });
      }
    });

    gsap.set('.header-thumbnail', { scale: 0, opacity: 0 });

    buttons.forEach((btn: any) => {
      if (btn) gsap.set(btn, { scale: 0, opacity: 0 });
    });

    // --- TIMELINE 1: First Card Entrance ---
    const firstWrapper = wrappers[0];
    const firstBtn = buttons[0];
    if (firstWrapper) {
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: cards[0] as HTMLElement,
          start: 'top top+=50',
          end: 'bottom-=20% top+=50',
          scrub: 2,
        }
      });

      tl1.to(firstWrapper, {
        width: '100%',
        ease: 'none',
      }, 0);

      if (firstBtn) {
        tl1.to(firstBtn, {
          scale: 1,
          opacity: 1,
          ease: 'none',
        }, 0);
      }
    }

    // --- TIMELINES FOR SUBSEQUENT CARDS (Exit of i-1 / Entrance of i) ---
    for (let i = 1; i < cards.length; i++) {
      const prevWrapper = wrappers[i - 1];
      const currWrapper = wrappers[i];
      const prevThumbnail = thumbnails[i - 1];
      const prevBtn = buttons[i - 1];
      const currBtn = buttons[i];

      if (!prevWrapper || !currWrapper) continue;

      const headerHeight = 50;
      const stickyTop = (i + 1) * headerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cards[i] as HTMLElement,
          start: 'top bottom-=200px',
          end: `top top-=${stickyTop + 100}px`,
          scrub: 2,
        }
      });

      tl.set(prevWrapper, { marginLeft: 'auto', marginRight: '0' }, 0)
        .set(currWrapper, { marginLeft: '0', marginRight: 'auto' }, 0)
        .to(prevWrapper, {
          width: '0%',
          ease: 'none',
        }, 0)
        .to(currWrapper, {
          width: '100%',
          ease: 'none',
        }, 0);

      if (prevThumbnail) {
        tl.to(prevThumbnail, {
          scale: 1,
          opacity: 1,
          ease: 'none',
        }, 0);
      }

      if (prevBtn) {
        tl.to(prevBtn, {
          scale: 0,
          opacity: 0,
          ease: 'none',
        }, 0);
      }

      if (currBtn) {
        tl.to(currBtn, {
          scale: 1,
          opacity: 1,
          ease: 'none',
        }, 0);
      }
    }

  }, { scope: containerRef });
}
