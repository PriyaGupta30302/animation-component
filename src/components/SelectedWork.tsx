'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  id: string;
  brand: string;
  industry: string;
  year: string;
  image: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'eon-studio',
    brand: 'Eon Studio',
    industry: 'Digital Design Agency',
    year: '2023',
    image: '/selected_work_1.png',
  },
  {
    id: 'cinder-ash',
    brand: 'Cinder & Ash',
    industry: 'Furniture / Home Decor',
    year: '2025',
    image: '/selected_work_2.png',
  },
  {
    id: 'studio-nectar',
    brand: 'Studio Nectar',
    industry: 'Architecture / Interior',
    year: '2026',
    image: '/web_development.png',
  },
];

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Header entrance animations
    gsap.fromTo('.heading-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.2 }
    );

    // 2. Setup ScrollTriggers for each project container
    const cards = gsap.utils.toArray('.project-card');
    cards.forEach((card: any, index: number) => {
      const largeImage = card.querySelector('.project-large-image');
      const largeImageWrapper = card.querySelector('.project-image-wrapper');
      const thumbnail = card.querySelector('.header-thumbnail');
      const viewProjectBtn = card.querySelector('.view-project-btn');

      if (!largeImage || !largeImageWrapper || !thumbnail) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom', // Start animating when card top reaches bottom of viewport
          end: 'bottom top',   // End when card bottom leaves top of viewport
          scrub: 1,            // Smooth scrub rate
        }
      });

      // Phase 1: Entrance (Smooth scale up / zoom-out from left as it enters)
      tl.fromTo(largeImageWrapper,
        { 
          scale: 0.6, 
          clipPath: 'inset(0% 100% 0% 0%)', // Reveal from left side
          opacity: 0 
        },
        { 
          scale: 1, 
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out'
        }
      );

      // Phase 2: Active Hover/Scroll Zoom in/out
      tl.to(largeImage, {
        scale: 1.15,
        duration: 0.3,
        ease: 'none'
      });

      // Phase 3: Exit/Shrink into Sticky Header (Shrink to thumbnail)
      // As the card moves past, the large image shrinks completely
      // and the tiny thumbnail in the sticky header scales up in sync!
      tl.to(largeImageWrapper, {
        scale: 0,
        opacity: 0,
        y: -100,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      .to(thumbnail, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: 'back.out(1.5)'
      }, '-=0.2');

      if (viewProjectBtn) {
        tl.to(viewProjectBtn, {
          scale: 0,
          opacity: 0,
          duration: 0.1
        }, '-=0.3');
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#fcfcfc] text-[#111111] py-20 border-t border-[#dddddd]">
      
      {/* (Selected) Work Heading */}
      <div className="w-full px-6 md:px-16 lg:px-24 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <h2 className="heading-text text-5xl md:text-8xl lg:text-9xl font-light tracking-tight font-serif text-[#111111] leading-none">
          (Selected)
        </h2>
        <h2 className="heading-text text-5xl md:text-8xl lg:text-9xl font-light tracking-tight font-serif text-[#111111] leading-none md:text-right">
          Work
        </h2>
      </div>

      {/* Control Icons Bar */}
      <div className="w-full px-6 md:px-16 lg:px-24 pb-8 flex items-center gap-4">
        {/* List layout icon */}
        <button className="text-neutral-900 hover:text-neutral-500 transition-colors p-1 cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Grid layout icon */}
        <button className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h5v5H4V6zm11 0h5v5h-5V6zM4 15h5v5H4v-5zm11 0h5v5h-5v-5z" />
          </svg>
        </button>
      </div>

      {/* Column Titles Bar */}
      <div className="w-full px-6 md:px-16 lg:px-24 border-t border-b border-[#eeeeee] py-4 bg-[#fcfcfc]">
        <div className="grid grid-cols-[1.5fr_2fr_1fr_80px] gap-4 w-full text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
          <span>Brand</span>
          <span className="text-center">Industry</span>
          <span className="text-right">Year</span>
          <span className="text-right pr-2">Preview</span>
        </div>
      </div>

      {/* Projects List Container */}
      <div className="w-full flex flex-col relative">
        {PROJECTS.map((project, index) => {
          // Staggered sticky header tops
          // Each header is sticky right underneath the previous one!
          const headerHeight = 60;
          const stickyTop = 100 + index * headerHeight;

          return (
            <div
              key={project.id}
              className="project-card w-full flex flex-col relative border-b border-[#eeeeee]"
            >
              {/* Sticky Header Bar */}
              <div
                style={{
                  position: 'sticky',
                  top: `${stickyTop}px`,
                  zIndex: (index + 1) * 10,
                }}
                className="w-full bg-[#fcfcfc] border-b border-[#eeeeee] py-5 px-6 md:px-16 lg:px-24 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
              >
                <div className="grid grid-cols-[1.5fr_2fr_1fr_80px] gap-4 items-center w-full">
                  {/* Brand */}
                  <span className="text-base md:text-lg font-light text-[#111111]">
                    {project.brand}
                  </span>
                  
                  {/* Industry */}
                  <span className="text-center text-sm md:text-base font-light text-neutral-600">
                    {project.industry}
                  </span>
                  
                  {/* Year */}
                  <span className="text-right text-sm md:text-base font-mono text-neutral-500">
                    {project.year}
                  </span>

                  {/* Thumbnail slot on the far right (fades in as large image collapses) */}
                  <div className="flex justify-end items-center pr-2">
                    <div
                      className="header-thumbnail w-[50px] h-[30px] rounded-[3px] overflow-hidden bg-neutral-200 border border-neutral-300/40 shadow-inner scale-0 opacity-0 origin-right transition-transform"
                    >
                      <img
                        src={project.image}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Main Body content (large image & button) */}
              <div className="w-full px-6 md:px-16 lg:px-24 py-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 bg-[#fcfcfc]/50 min-h-[60vh]">
                {/* Large Image Frame (Scales and shrinks based on scroll position) */}
                <div 
                  className="project-image-wrapper w-full md:w-[65%] h-[350px] md:h-[450px] overflow-hidden rounded-md bg-[#eeeeee] shadow-sm relative"
                >
                  <img
                    src={project.image}
                    alt={project.brand}
                    className="project-large-image w-full h-full object-cover origin-center"
                  />
                </div>

                {/* Interactive circular View Project CTA */}
                <div className="w-full md:w-[30%] flex justify-center md:justify-end pr-6 pb-6">
                  <div 
                    className="view-project-btn w-28 h-28 md:w-36 md:h-36 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors flex items-center justify-center cursor-pointer group bg-white shadow-sm"
                  >
                    <span className="text-xs md:text-sm font-mono tracking-wider text-neutral-700 group-hover:text-neutral-900 text-center">
                      View<br />Project
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
