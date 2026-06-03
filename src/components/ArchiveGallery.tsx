'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Vertex-based layout (all positions within 100vh sticky viewport) ────────
//
//  img1: left: 4vw,  top: 10vh,  W:38vw, H:34vh → right-bottom: (42vw, 44vh)
//  img2: left:42vw,  top: 44vh,  W:36vw, H:24vh → left-bottom:  (42vw, 68vh)
//  img3: left:26vw,  top: 68vh,  W:16vw, H:14vh → left-bottom:  (26vw, 82vh)
//  img4: left:12vw,  top: 82vh,  W:14vw, H:12vh → right-bottom: (26vw, 94vh)
//  img5: left:26vw,  bottom:6vh, W:56vw, H:22vh ← bottom=94vh = img4 right-bottom ✓
//
//  Touch proof:
//    img2.left(42) = img1.left+W(4+38=42)  ✓   img2.top(44) = img1.top+H(10+34=44) ✓
//    img3.right(42)= img2.left(42)         ✓   img3.top(68) = img2.top+H(44+24=68) ✓
//    img4.right(26)= img3.left(26)         ✓   img4.top(82) = img3.top+H(68+14=82) ✓
//    img5.left(26) = img4.right(12+14=26)  ✓   img5.bottom  = img4.top+H(82+12=94) ✓
// ─────────────────────────────────────────────────────────────────────────────

interface Item {
  id: number;
  src: string;
  label: string;
  pos: React.CSSProperties;   // final size + position
  zIndex: number;
}

const INITIAL_CLIP = 'inset(100% 100% 0% 0%)';  // fully hidden, origin = bottom-left
const FINAL_CLIP = 'inset(0% 0% 0% 0%)';       // fully visible

const ITEMS: Item[] = [
  {
    id: 1, src: '/selected_work_1.png', label: 'Haus of Sonder',
    pos: { left: '4vw', top: '10vh', width: '38vw', height: '34vh' },
    zIndex: 1,
  },
  {
    id: 2, src: '/digital_marketing.png', label: 'Nomad Atelier',
    pos: { left: '42vw', top: '44vh', width: '36vw', height: '24vh' },
    zIndex: 2,
  },
  {
    id: 3, src: '/web_development.png', label: 'Golden Hour Co.',
    pos: { left: '26vw', top: '68vh', width: '16vw', height: '14vh' },
    zIndex: 3,
  },
  {
    id: 4, src: '/logo_design.png', label: 'Project Mirage',
    pos: { left: '12vw', top: '82vh', width: '14vw', height: '12vh' },
    zIndex: 4,
  },
  {
    id: 5, src: '/branding_mockup.png', label: 'Studio Archive',
    // bottom: 6vh → bottom edge sits at 94vh = img4's right-bottom vertex
    pos: { left: '26vw', bottom: '6vh', width: '56vw', height: '22vh' },
    zIndex: 5,
  },
];

// Section tall enough that 5 × 1-unit timeline gets comfortable scroll space.
// With start:'top top', end:'bottom bottom':
//   scroll-distance = sectionHeight − viewportHeight
//   ≈ 650vh − 100vh = 550vh for 5 images → 110vh per image. Feels deliberate.
const SECTION_HEIGHT = '650vh';

export default function ArchiveGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // ── Heading entrance ──────────────────────────────────────────────────
    gsap.fromTo(
      '.archive-heading',
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── Master sequential timeline ────────────────────────────────────────
    // Each image gets duration=1 placed back-to-back (no overlap, no gap).
    // Image N+1 starts EXACTLY when image N finishes.
    const wrappers = gsap.utils.toArray<HTMLElement>('.archive-img-wrapper');

    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    wrappers.forEach((wrapper) => {
      tl.fromTo(
        wrapper,
        { clipPath: INITIAL_CLIP },
        { clipPath: FINAL_CLIP, duration: 1 }
      );
      // no gap → next image starts immediately
    });

    // Bind timeline progress to section scroll
    ScrollTrigger.create({
      animation: tl,
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,   // scrub:1 keeps tight sync (minimal lag) for sequential feel
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f8f8f6] border-t border-[#dddddd]"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* ── Sticky viewport: all images live here ───────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Heading */}
        <div
          className="archive-heading absolute left-[4vw] z-20 flex items-center"
          style={{ top: 0, height: '10vh' }}
        >
          <h2
            className="font-serif font-light tracking-tight text-[#111111] leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)' }}
          >
            ( Archive )
          </h2>
        </div>

        {/* Images */}
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="archive-img-wrapper absolute overflow-hidden"
            style={{
              ...item.pos,
              zIndex: item.zIndex,
              // Initial state set here avoids FOUC before GSAP runs
              clipPath: INITIAL_CLIP,
            }}
          >
            <img
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Label — clipped with the image, reveals naturally */}
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <span className="text-[10px] font-sans tracking-widest uppercase text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5">
                ( {item.label} )
              </span>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
