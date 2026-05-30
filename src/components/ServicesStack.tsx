'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  image: string;
  tools: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'logo-design',
    number: '01',
    title: 'Logo Design',
    image: '/logo_design.png',
    tools: [
      'Concept Development',
      'Sketches & Symbol Exploration',
      'Color Palette Creation',
      'Logo Refinement & Finalization',
      'Brand Mark Guidelines',
    ],
  },
  {
    id: 'branding',
    number: '02',
    title: 'Branding',
    image: '/branding_mockup.png',
    tools: [
      'Insights',
      'Brand Strategy',
      'Logo & Mark Creation',
      'Typography & Color Systems',
      'Responsive Design for All Devices',
    ],
  },
  {
    id: 'web-dev',
    number: '03',
    title: 'Web Design/Development',
    image: '/web_development.png',
    tools: [
      'UX Research & Wireframing',
      'User Journey Mapping',
      'UI Design & Prototyping',
      'Layouts & Visual Hierarchy',
      'Responsive Design for All Devices',
    ],
  },
  {
    id: 'mobile-app',
    number: '04',
    title: 'Mobile App Development',
    image: '/mobile_app.png',
    tools: [
      'iOS & Android Prototypes',
      'Material Design Guidelines',
      'Dynamic Gesture Controls',
      'Micro-interactions & Motion',
      'API Integration Pipelines',
    ],
  },
  {
    id: 'marketing',
    number: '05',
    title: 'Digital Marketing & Strategy',
    image: '/digital_marketing.png',
    tools: [
      'Audience Insights & Analytics',
      'Content Strategy Planners',
      'Performance Campaign Launches',
      'Conversion Rate Optimization',
      'Multi-channel SEO Audits',
    ],
  },
];

export default function ServicesStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Subtle fade-in entrance for the service header elements
    gsap.fromTo('.services-header-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Subtle scale-up animation for the card images as they scroll into view
    const images = gsap.utils.toArray('.card-image');
    images.forEach((img: any) => {
      gsap.fromTo(img,
        { scale: 1.08 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#fcfcfc] text-[#111111] py-20">
      {/* 1. Header Section */}
      <div className="w-full mb-16 px-6 md:px-16 lg:px-24">
        <h2 className="services-header-title text-5xl md:text-7xl font-light tracking-tight text-[#111111] font-serif pb-6">
          Our Services
        </h2>
      </div>

      {/* 2. Sticky Stacking Cards Container */}
      <div className="relative w-full flex flex-col">
        {SERVICES.map((service, index) => {
          // Staggered sticky top offsets
          // Card 1 sticks at 100px, Card 2 sticks at 180px, Card 3 at 260px, etc.
          // This leaves exactly an 80px header band of the previous card visible when stacked!
          const stickyTop = 100 + index * 80;
          const isLastCard = index === SERVICES.length - 1;

          return (
            <div
              key={service.id}
              style={{ 
                position: isLastCard ? 'relative' : 'sticky', 
                top: isLastCard ? undefined : `${stickyTop}px`,
                zIndex: (index + 1) * 10 
              }}
              className="w-full bg-[#fcfcfc] border-t border-[#dddddd] shadow-[0_-1px_0_rgba(0,0,0,0.05)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[280px_60px_1fr_280px] gap-8 items-start py-5 px-6 md:px-16 lg:px-24">
                {/* Column 1: Image container */}
                <div className="w-full h-[360px] md:h-[400px] overflow-hidden bg-[#f0f0f0] rounded-sm group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="card-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Column 2: Service Numbering */}
                <div className="text-xl md:text-2xl font-mono text-[#222222] font-light md:pt-1">
                  {service.number}
                </div>

                {/* Column 3: Service Title */}
                <div className="md:pt-0">
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111] leading-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Column 4: Tools List with Horizontal Rule Splits */}
                <div className="w-full md:pt-1">
                  <span className="block text-[11px] font-mono tracking-widest uppercase text-neutral-500 mb-6">
                    Tools
                  </span>
                  <ul className="border-t border-[#eeeeee]">
                    {service.tools.map((tool, idx) => (
                      <li
                        key={idx}
                        className="py-3 text-[14px] font-light text-neutral-800 border-b border-[#eeeeee] leading-relaxed"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
