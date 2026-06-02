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
    wrappers.forEach((wrapper: any) => {
      if (wrapper) gsap.set(wrapper, { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)' });
    });

    gsap.set('.header-thumbnail', { scale: 0, opacity: 0 });

    buttons.forEach((btn: any) => {
      if (btn) gsap.set(btn, { scale: 0, opacity: 0 });
    });

    // --- Dynamic 3-Phase Animation Loop for all cards ---
    for (let i = 0; i < cards.length; i++) {
      const wrapper = wrappers[i];
      const thumbnail = thumbnails[i];
      const btn = buttons[i];

      if (!wrapper) continue;

      const headerHeight = 50;
      const stickyTop = (i * headerHeight) + 50;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cards[i] as HTMLElement,
          start: `top top+=${stickyTop}`,
          end: `bottom top+=${stickyTop}`,
          scrub: 2,
        }
      });

      if (i === 0) {
        // --- Card 0 (Eon Studio): First Card Special Entrance ---
        // 1. Entrance (0.0 to 0.4): grows diagonally from bottom-left corner to full-bleed
        tl.fromTo(wrapper,
          { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.4,
            ease: 'none',
          },
          0
        );

        if (btn) {
          tl.to(btn, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'none',
          }, 0);
        }

        // 2. Active Stay (0.4 to 1.0): remains fully visible
        tl.to({}, { duration: 0.6 }, 0.4);

      } else {
        // --- Subsequent Cards (Index i > 0): Exit of i-1 & Entrance of i ---
        const prevWrapper = wrappers[i - 1];
        const prevThumbnail = thumbnails[i - 1];
        const prevBtn = buttons[i - 1];

        // 1. Initial Stay (0.0 to 0.2): prev card remains fully visible
        tl.to({}, { duration: 0.2 }, 0);

        // 2. The Symmetrical Crossover (0.2 to 0.8):
        // prev wrapper shrinks diagonally towards the bottom-right corner
        // current wrapper grows diagonally from the bottom-left corner
        if (prevWrapper) {
          tl.fromTo(prevWrapper,
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
            {
              clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
              duration: 0.6,
              ease: 'none',
            },
            0.2
          );
        }

        tl.fromTo(wrapper,
          { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.6,
            ease: 'none',
          },
          0.2
        );

        if (prevThumbnail) {
          tl.to(prevThumbnail, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'none',
          }, 0.2);
        }

        if (prevBtn) {
          tl.to(prevBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: 'none',
          }, 0.2);
        }

        if (btn) {
          tl.to(btn, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'none',
          }, 0.2);
        }

        // 3. Final Active Stay (0.8 to 1.0): current card remains fully visible
        tl.to({}, { duration: 0.2 }, 0.8);
      }
    }

  }, { scope: containerRef });
}
