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

    const wrappers = gsap.utils.toArray('.project-image-wrapper') as any[];
    const thumbnails = gsap.utils.toArray('.header-thumbnail') as any[];
    const buttons = gsap.utils.toArray('.view-project-btn') as any[];
    const headers = gsap.utils.toArray('.project-header') as any[];

    // Set initial states
    wrappers.forEach((wrapper: any, idx: number) => {
      if (wrapper) {
        const headerHeight = 44;
        const stickyTop = (idx + 1) * headerHeight;
        const Y = stickyTop + headerHeight;
        const H = window.innerHeight - Y; // Fill remaining viewport below stacked headers

        gsap.set(wrapper, {
          width: '0%',
          height: '0px',
          top: idx === 0 ? `${Y}px` : `${Y + H}px`, // Card 0 starts directly under its header
          left: '0',
          right: 'auto',
          marginLeft: '0',
          marginRight: 'auto',
        });

        // Initialize header: card 0 at its stickyTop, future cards hidden just below viewport
        if (headers[idx]) {
          gsap.set(headers[idx], {
            top: idx === 0 ? `${stickyTop}px` : `${window.innerHeight + 1}px`,
          });
        }
      }
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

      const headerHeight = 44;
      const stickyTop = (i + 1) * headerHeight;
      const Y = stickyTop + headerHeight;
      const H = window.innerHeight - Y; // Fill remaining viewport below stacked headers

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cards[i] as HTMLElement,
          start: i === 0 ? 'top bottom' : `top top+=${stickyTop}`,
          end: i === 0 ? `top top+=${stickyTop}` : `bottom top+=${stickyTop}`,
          scrub: 2,
        }
      });

      if (i === 0) {
        // --- Card 0 (Eon Studio): First Card Special Entrance ---
        tl.to(wrapper, {
          width: '100%',
          height: `${H}px`,
          top: `${Y}px`,
          duration: 1.0,
          ease: 'none',
        }, 0);

        if (btn) {
          tl.to(btn, {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: 'none',
          }, 0);
        }

      } else {
        // --- Card i (i > 0): Symmetrical crossover of Card i-1 and Card i ---
        const prevWrapper = wrappers[i - 1];
        const prevThumbnail = thumbnails[i - 1];
        const prevBtn = buttons[i - 1];

        // 1. Initial Stay (0.0 to 0.1): previous card stays at 100%
        tl.to({}, { duration: 0.1 }, 0);

        // 2. Symmetrical Crossover (0.1 to 0.9): Previous card vanishes, current expands
        if (prevWrapper) {
          tl.set(prevWrapper, { left: 'auto', right: '0' }, 0.1)
            .to(prevWrapper, {
              width: '0%',
              height: '0px',
              duration: 0.8,
              ease: 'none',
            }, 0.1);
        }

        tl.to(wrapper, {
          width: '100%',
          height: `${H}px`,
          top: `${Y}px`,
          duration: 0.8,
          ease: 'none',
        }, 0.1);

        if (prevThumbnail) {
          tl.to(prevThumbnail, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'none',
          }, 0.1);
        }

        if (prevBtn) {
          tl.to(prevBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'none',
          }, 0.1);
        }

        if (btn) {
          tl.to(btn, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'none',
          }, 0.1);
        }

        if (headers[i]) {
          tl.to(headers[i], {
            top: `${stickyTop}px`,
            duration: 0.8,
            ease: 'none',
          }, 0.1)
          // While floating in (crossover) → light gray border
          .set(headers[i], { borderBottomColor: '#dddddd' }, 0.1)
          // Once settled into the stack → back to black
          .set(headers[i], { borderBottomColor: '#111111' }, 0.9);
        }



        // 3. Final Active Stay (0.9 to 1.0)
        tl.to({}, { duration: 0.1 }, 0.9);
      }
    }

  }, { scope: containerRef });
}
