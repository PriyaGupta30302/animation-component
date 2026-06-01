'use client';

import { useRef } from 'react';
import { useSelectedWorkAnimation } from './SelectedWorkAnimation';

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
  {
    id: 'quantum-lab',
    brand: 'Quantum Lab',
    industry: 'AI Research Platform',
    year: '2026',
    image: '/mobile_app.png',
  },
  {
    id: 'urban-flora',
    brand: 'Urban Flora',
    industry: 'Sustainable Landscape',
    year: '2027',
    image: '/branding_mockup.png',
  },
];

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  useSelectedWorkAnimation(containerRef);

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
      <div className="w-full border-b border-black p-4 bg-[#fcfcfc] sticky top-0 z-50">
        <div className="grid grid-cols-[1.5fr_2fr_1fr_80px] gap-4 w-full text-[18px] text-black font-sans font-medium">
          <span>Brand</span>
          <span className="text-center">Industry</span>
          <span className="text-right">Year</span>
          <span className="text-right pr-2"></span>
        </div>
      </div>

      {/* Projects List Container */}
      <div className="w-full flex flex-col relative">
        {PROJECTS.map((project, index) => {
          // Staggered sticky header tops
          // Each header is sticky right underneath the previous one!
          const headerHeight = 50;
          const stickyTop = (index + 1) * headerHeight;
          const headerZIndex = 50 - index;
          const imageZIndex = 40 - index;

          return (
            <div key={project.id} className="contents">
              {/* Sticky Header Bar */}
              <div
                style={{
                  position: 'sticky',
                  top: `${stickyTop}px`,
                  zIndex: headerZIndex,
                }}
                className="w-full bg-[#fcfcfc] border-b border-black p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
              >
                <div className="grid grid-cols-[1.5fr_2fr_1fr_80px] gap-4 items-center w-full">
                  {/* Brand */}
                  <span className="text-[18px] font-normal text-black font-sans">
                    {project.brand}
                  </span>

                  {/* Industry */}
                  <span className="text-center text-[18px] font-normal text-black font-sans">
                    {project.industry}
                  </span>

                  {/* Year */}
                  <span className="text-right text-[18px] font-normal text-black font-sans">
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

              {/* Card Main Body content (large full-width image & overlay button) */}
              <div className="project-card w-full py-0 bg-[#fcfcfc]/50 relative border-b border-[#eeeeee] min-h-[160vh]">
                {/* Large Image Frame (Scales and shrinks based on scroll position) */}
                <div
                  style={{
                    position: 'sticky',
                    top: `${stickyTop + headerHeight}px`,
                    zIndex: imageZIndex,
                  }}
                  className="project-image-wrapper w-full h-[350px] md:h-[600px] overflow-hidden bg-[#eeeeee] shadow-sm relative ml-0 mr-auto"
                >
                  <img
                    src={project.image}
                    alt={project.brand}
                    className="project-large-image w-full h-full object-cover origin-center"
                  />

                  {/* Interactive circular View Project CTA overlay */}
                  <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className="view-project-btn w-24 h-24 md:w-32 md:h-32 rounded-full border border-neutral-200/60 bg-white shadow-md flex items-center justify-center cursor-pointer group hover:scale-105 hover:border-neutral-900 transition-all duration-300"
                    >
                      <span className="text-xs md:text-sm font-sans font-medium tracking-wider text-neutral-800 group-hover:text-neutral-900 text-center">
                        View<br />Project
                      </span>
                    </div>
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
