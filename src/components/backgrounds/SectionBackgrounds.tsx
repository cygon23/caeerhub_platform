// Animated Background Components for Different Sections
// Each background is themed for its specific content area

import React from 'react';

// ============================================
// HERO SECTION - AI & Technology Theme
// ============================================
export const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated Grid */}
    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="currentColor" className="text-[#FE047F]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>

    {/* AI Circuit Pattern - Top Right */}
    <svg
      className="absolute top-10 right-10 w-64 h-64 opacity-10 animate-pulse-scale"
      style={{ animationDuration: '8s' }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg">
      {/* Circuit lines */}
      <path d="M20 100 H80 V40 H120 V100 H180" stroke="#FE047F" strokeWidth="2" fill="none" strokeDasharray="5 5">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M100 20 V80 H160 V120 H100 V180" stroke="#00690D" strokeWidth="2" fill="none" strokeDasharray="5 5">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Circuit nodes */}
      <circle cx="80" cy="100" r="4" fill="#FE047F" />
      <circle cx="120" cy="40" r="4" fill="#00690D" />
      <circle cx="160" cy="120" r="4" fill="#FE047F" />
      <circle cx="100" cy="80" r="3" fill="#00690D" />
    </svg>

    {/* Neural Network - Bottom Left */}
    <svg
      className="absolute bottom-20 left-10 w-72 h-72 opacity-10"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg">
      {/* Network connections */}
      <g stroke="#FE047F" strokeWidth="1" opacity="0.6">
        <line x1="40" y1="40" x2="160" y2="40" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="40" y1="40" x2="100" y2="160" />
        <line x1="160" y1="40" x2="100" y2="160" />
        <line x1="40" y1="100" x2="100" y2="160" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="160" y1="100" x2="100" y2="160" />
      </g>
      {/* Nodes with pulse animation */}
      <circle cx="40" cy="40" r="5" fill="#FE047F">
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="40" r="5" fill="#00690D">
        <animate attributeName="r" values="5;7;5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="100" r="4" fill="#FE047F">
        <animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="100" r="4" fill="#00690D">
        <animate attributeName="r" values="4;6;4" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="160" r="6" fill="#FE047F">
        <animate attributeName="r" values="6;8;6" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>

    {/* Floating Hexagons - Tech Pattern */}
    <svg className="absolute top-1/3 right-1/4 w-32 h-32 opacity-5 animate-float" style={{ animationDuration: '6s' }} viewBox="0 0 100 100">
      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#FE047F" strokeWidth="2" />
      <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="#00690D" strokeWidth="1.5" />
    </svg>

    {/* Gradient Orbs */}
    <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#FE047F]/10 rounded-full blur-3xl animate-pulse-scale" style={{ animationDuration: '10s' }}></div>
    <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#00690D]/10 rounded-full blur-3xl animate-pulse-scale" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
  </div>
);

// ============================================
// STATS SECTION - Data & Analytics Theme
// ============================================
export const StatsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated Bar Charts */}
    <svg className="absolute top-10 right-20 w-48 h-48 opacity-5" viewBox="0 0 200 200">
      <rect x="20" y="100" width="30" height="80" fill="#FE047F" opacity="0.6">
        <animate attributeName="height" values="80;120;80" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y" values="100;60;100" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="65" y="70" width="30" height="110" fill="#00690D" opacity="0.6">
        <animate attributeName="height" values="110;90;110" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y" values="70;90;70" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="110" y="50" width="30" height="130" fill="#FE047F" opacity="0.6">
        <animate attributeName="height" values="130;100;130" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="y" values="50;80;50" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="155" y="80" width="30" height="100" fill="#00690D" opacity="0.6">
        <animate attributeName="height" values="100;140;100" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="y" values="80;40;80" dur="2.8s" repeatCount="indefinite" />
      </rect>
    </svg>

    {/* Pie Chart Segments */}
    <svg className="absolute bottom-20 left-10 w-40 h-40 opacity-5 animate-spin" style={{ animationDuration: '30s' }} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#FE047F" strokeWidth="20" strokeDasharray="75 251" transform="rotate(-90 50 50)" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#00690D" strokeWidth="20" strokeDasharray="100 251" strokeDashoffset="-75" transform="rotate(-90 50 50)" />
    </svg>

    {/* Data Points Network */}
    <svg className="absolute top-1/2 left-1/3 w-56 h-56 opacity-5" viewBox="0 0 200 200">
      {[...Array(6)].map((_, i) => (
        <circle
          key={i}
          cx={100 + 60 * Math.cos((i * Math.PI) / 3)}
          cy={100 + 60 * Math.sin((i * Math.PI) / 3)}
          r="5"
          fill={i % 2 === 0 ? '#FE047F' : '#00690D'}>
          <animate attributeName="r" values="5;8;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  </div>
);

// ============================================
// HOW IT WORKS - Journey & Process Theme
// ============================================
export const JourneyBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Winding Path */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 800" preserveAspectRatio="none">
      <path
        d="M 0,400 Q 250,200 500,400 T 1000,400"
        fill="none"
        stroke="#FE047F"
        strokeWidth="3"
        strokeDasharray="10 5">
        <animate attributeName="stroke-dashoffset" from="0" to="30" dur="4s" repeatCount="indefinite" />
      </path>
      <path
        d="M 0,450 Q 250,650 500,450 T 1000,450"
        fill="none"
        stroke="#00690D"
        strokeWidth="2"
        strokeDasharray="8 4"
        opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="24" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* Milestone Markers */}
    <svg className="absolute top-20 left-20 w-24 h-24 opacity-10 animate-float" style={{ animationDuration: '5s' }} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#FE047F" strokeWidth="2" />
      <path d="M 50,20 L 50,80 M 30,50 L 70,50" stroke="#FE047F" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="#FE047F">
        <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>

    {/* Arrow Progress Indicators */}
    <svg className="absolute bottom-1/4 right-20 w-40 h-40 opacity-8" viewBox="0 0 100 100">
      <path d="M 20,50 L 80,50 L 70,40 M 80,50 L 70,60" stroke="#00690D" strokeWidth="3" fill="none" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="0 100; 100 0" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* Step Circles */}
    <svg className="absolute top-1/3 right-1/4 w-32 h-32 opacity-5" viewBox="0 0 100 100">
      <circle cx="25" cy="50" r="8" fill="#FE047F" />
      <circle cx="50" cy="50" r="10" fill="#00690D">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="50" r="8" fill="#FE047F" />
    </svg>
  </div>
);

// ============================================
// FEATURES - Innovation & Tech Theme
// ============================================
export const FeaturesBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gear/Cog Wheels */}
    <svg className="absolute top-10 left-10 w-32 h-32 opacity-5 animate-spin" style={{ animationDuration: '15s' }} viewBox="0 0 100 100">
      <path
        d="M50,10 L55,20 L65,18 L68,28 L78,30 L76,40 L85,45 L80,55 L88,62 L78,68 L80,78 L70,76 L65,85 L55,80 L50,90 L45,80 L35,85 L30,76 L20,78 L22,68 L12,62 L20,55 L15,45 L24,40 L22,30 L32,28 L35,18 L45,20 Z"
        fill="none"
        stroke="#FE047F"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#FE047F" strokeWidth="2" />
    </svg>

    <svg className="absolute bottom-20 right-10 w-40 h-40 opacity-5 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
      <path
        d="M50,5 L54,18 L67,15 L70,28 L83,28 L82,41 L93,48 L85,58 L90,70 L77,74 L75,87 L62,85 L55,95 L48,85 L35,87 L33,74 L20,70 L25,58 L17,48 L28,41 L27,28 L40,28 L43,15 L56,18 Z"
        fill="none"
        stroke="#00690D"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="18" fill="none" stroke="#00690D" strokeWidth="2" />
    </svg>

    {/* Lightning Bolts - Innovation */}
    <svg className="absolute top-1/3 right-1/4 w-20 h-32 opacity-8" viewBox="0 0 50 100">
      <path d="M 25,10 L 15,45 L 30,45 L 20,90" stroke="#FE047F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* Atomic Orbits */}
    <svg className="absolute bottom-1/4 left-1/4 w-48 h-48 opacity-5" viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#00690D" strokeWidth="1" transform="rotate(0 50 50)">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#FE047F" strokeWidth="1" transform="rotate(60 50 50)">
        <animateTransform attributeName="transform" type="rotate" from="60 50 50" to="420 50 50" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#00690D" strokeWidth="1" transform="rotate(120 50 50)">
        <animateTransform attributeName="transform" type="rotate" from="120 50 50" to="480 50 50" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="50" cy="50" r="5" fill="#FE047F">
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

// ============================================
// TESTIMONIALS - People & Success Theme
// ============================================
export const TestimonialsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Speech Bubbles */}
    <svg className="absolute top-20 left-10 w-32 h-32 opacity-5 animate-float" style={{ animationDuration: '6s' }} viewBox="0 0 100 100">
      <rect x="10" y="20" width="70" height="50" rx="10" fill="none" stroke="#FE047F" strokeWidth="2" />
      <path d="M 30,70 L 35,80 L 45,70" fill="#FE047F" opacity="0.3" />
      <circle cx="30" cy="40" r="3" fill="#FE047F" />
      <circle cx="50" cy="40" r="3" fill="#FE047F" />
      <circle cx="70" cy="40" r="3" fill="#FE047F" />
    </svg>

    <svg className="absolute bottom-1/4 right-20 w-28 h-28 opacity-5 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }} viewBox="0 0 100 100">
      <rect x="20" y="25" width="65" height="45" rx="8" fill="none" stroke="#00690D" strokeWidth="2" />
      <path d="M 70,70 L 75,85 L 80,70" fill="#00690D" opacity="0.3" />
    </svg>

    {/* Star Ratings */}
    <svg className="absolute top-1/2 left-1/4 w-40 h-8 opacity-8" viewBox="0 0 120 20">
      {[0, 25, 50, 75, 100].map((x, i) => (
        <polygon
          key={i}
          points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
          fill="#FE047F"
          transform={`translate(${x}, 0)`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
        </polygon>
      ))}
    </svg>

    {/* Heart Icons - Love/Success */}
    <svg className="absolute bottom-10 left-1/3 w-16 h-16 opacity-5 animate-pulse" viewBox="0 0 100 100">
      <path
        d="M50,85 C50,85 20,60 20,40 C20,25 30,15 40,15 C45,15 50,20 50,20 C50,20 55,15 60,15 C70,15 80,25 80,40 C80,60 50,85 50,85 Z"
        fill="#FE047F"
      />
    </svg>

    {/* Trophy/Achievement Icon */}
    <svg className="absolute top-1/3 right-10 w-24 h-24 opacity-5 animate-float" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
      <path d="M 35,30 L 35,50 L 30,60 L 70,60 L 65,50 L 65,30 Z" fill="none" stroke="#00690D" strokeWidth="2" />
      <rect x="40" y="60" width="20" height="20" fill="none" stroke="#00690D" strokeWidth="2" />
      <line x1="25" y1="80" x2="75" y2="80" stroke="#00690D" strokeWidth="3" />
      <path d="M 35,30 Q 20,25 20,15" stroke="#00690D" strokeWidth="2" fill="none" />
      <path d="M 65,30 Q 80,25 80,15" stroke="#00690D" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

// ============================================
// FAQ - Question & Answer Theme
// ============================================
export const FAQBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Question Marks */}
    <svg className="absolute top-10 right-20 w-16 h-24 opacity-5 animate-float" style={{ animationDuration: '5s' }} viewBox="0 0 50 100">
      <path d="M 25,20 Q 10,20 10,35 Q 10,45 25,50 L 25,65" stroke="#FE047F" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="80" r="4" fill="#FE047F" />
    </svg>

    <svg className="absolute bottom-20 left-10 w-14 h-20 opacity-5 animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }} viewBox="0 0 50 100">
      <path d="M 25,25 Q 40,25 40,40 Q 40,50 25,55 L 25,70" stroke="#00690D" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="85" r="3" fill="#00690D" />
    </svg>

    {/* Lightbulb - Ideas/Answers */}
    <svg className="absolute top-1/3 left-1/4 w-20 h-28 opacity-5" viewBox="0 0 50 70">
      <circle cx="25" cy="25" r="15" fill="none" stroke="#FE047F" strokeWidth="2">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <rect x="20" y="35" width="10" height="15" fill="none" stroke="#FE047F" strokeWidth="2" />
      <line x1="20" y1="50" x2="30" y2="50" stroke="#FE047F" strokeWidth="2" />
      <line x1="22" y1="53" x2="28" y2="53" stroke="#FE047F" strokeWidth="2" />
      <path d="M 25,10 L 25,5 M 10,15 L 6,11 M 10,35 L 6,39 M 40,15 L 44,11 M 40,35 L 44,39" stroke="#FE047F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>

    {/* Book/Knowledge Icons */}
    <svg className="absolute bottom-1/4 right-1/3 w-24 h-20 opacity-5 animate-float" style={{ animationDuration: '7s' }} viewBox="0 0 100 80">
      <rect x="10" y="20" width="80" height="50" rx="5" fill="none" stroke="#00690D" strokeWidth="2" />
      <line x1="50" y1="20" x2="50" y2="70" stroke="#00690D" strokeWidth="2" />
      <path d="M 30,35 L 40,35 M 30,45 L 40,45 M 30,55 L 40,55" stroke="#00690D" strokeWidth="1.5" />
      <path d="M 60,35 L 70,35 M 60,45 L 70,45 M 60,55 L 70,55" stroke="#00690D" strokeWidth="1.5" />
    </svg>
  </div>
);

// ============================================
// PARTNERS - Network & Connection Theme
// ============================================
export const PartnersBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Network Nodes */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 400">
      {/* Connection Lines */}
      <g stroke="#FE047F" strokeWidth="1" opacity="0.6">
        <line x1="200" y1="100" x2="400" y2="100">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="400" y1="100" x2="600" y2="100">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="600" y1="100" x2="800" y2="100">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="300" x2="400" y2="300">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="3.2s" repeatCount="indefinite" />
        </line>
        <line x1="400" y1="300" x2="600" y2="300">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="3.7s" repeatCount="indefinite" />
        </line>
        {/* Vertical Connections */}
        <line x1="400" y1="100" x2="400" y2="300" stroke="#00690D">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="600" y1="100" x2="600" y2="300" stroke="#00690D">
          <animate attributeName="stroke-dasharray" values="0 500; 500 0" dur="5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Network Nodes */}
      {[
        [200, 100],
        [400, 100],
        [600, 100],
        [800, 100],
        [200, 300],
        [400, 300],
        [600, 300],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill={i % 2 === 0 ? '#FE047F' : '#00690D'} opacity="0.6">
          <animate attributeName="r" values="8;12;8" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>

    {/* Handshake Icon */}
    <svg className="absolute top-20 left-10 w-32 h-32 opacity-5 animate-float" style={{ animationDuration: '6s' }} viewBox="0 0 100 100">
      <path d="M 20,50 L 35,35 L 50,50 L 65,35 L 80,50" stroke="#FE047F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 35,35 L 35,20 M 65,35 L 65,20" stroke="#FE047F" strokeWidth="3" strokeLinecap="round" />
    </svg>

    {/* Globe/World Icon */}
    <svg className="absolute bottom-10 right-20 w-28 h-28 opacity-5 animate-spin" style={{ animationDuration: '30s' }} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="35" fill="none" stroke="#00690D" strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="#00690D" strokeWidth="1.5" />
      <ellipse cx="50" cy="50" rx="15" ry="35" fill="none" stroke="#00690D" strokeWidth="1.5" />
      <line x1="15" y1="50" x2="85" y2="50" stroke="#00690D" strokeWidth="1" />
      <line x1="50" y1="15" x2="50" y2="85" stroke="#00690D" strokeWidth="1" />
    </svg>
  </div>
);

// ============================================
// CTA - Success & Achievement Theme
// ============================================
export const CTABackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Rising Arrows - Growth */}
    <svg className="absolute top-10 right-1/4 w-24 h-40 opacity-5" viewBox="0 0 50 100">
      <path d="M 25,80 L 25,30 L 15,40 M 25,30 L 35,40" stroke="#FE047F" strokeWidth="3" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-20; 0,0" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>

    <svg className="absolute bottom-20 left-1/4 w-28 h-44 opacity-5" viewBox="0 0 50 100">
      <path d="M 25,90 L 25,25 L 12,38 M 25,25 L 38,38" stroke="#00690D" strokeWidth="4" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-25; 0,0" dur="2.5s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* Rocket Launch */}
    <svg className="absolute top-1/3 left-10 w-20 h-32 opacity-5 animate-float" style={{ animationDuration: '5s' }} viewBox="0 0 50 100">
      <path d="M 25,10 L 20,40 L 15,50 L 20,60 L 25,90 L 30,60 L 35,50 L 30,40 Z" fill="none" stroke="#FE047F" strokeWidth="2" />
      <ellipse cx="25" cy="25" rx="8" ry="12" fill="none" stroke="#FE047F" strokeWidth="1.5" />
      <path d="M 15,50 L 10,55 L 15,60 M 35,50 L 40,55 L 35,60" fill="none" stroke="#FE047F" strokeWidth="2" />
    </svg>

    {/* Target/Goal Icon */}
    <svg className="absolute bottom-1/4 right-10 w-32 h-32 opacity-5" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#00690D" strokeWidth="2" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#00690D" strokeWidth="2" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="#FE047F" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="#FE047F">
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>

    {/* Success Checkmarks */}
    <svg className="absolute top-20 right-10 w-16 h-16 opacity-8" viewBox="0 0 50 50">
      <path d="M 10,25 L 20,35 L 40,15" stroke="#00690D" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dasharray" values="0 100; 100 0" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* Star Burst - Achievement */}
    <svg className="absolute top-1/2 right-1/3 w-24 h-24 opacity-5 animate-spin" style={{ animationDuration: '20s' }} viewBox="0 0 100 100">
      <path d="M 50,10 L 54,40 L 85,25 L 60,46 L 90,50 L 60,54 L 85,75 L 54,60 L 50,90 L 46,60 L 15,75 L 40,54 L 10,50 L 40,46 L 15,25 L 46,40 Z" fill="none" stroke="#FE047F" strokeWidth="1.5" />
    </svg>

    {/* Gradient Orbs */}
    <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#FE047F]/15 rounded-full blur-3xl animate-pulse-scale" style={{ animationDuration: '8s' }}></div>
    <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#00690D]/15 rounded-full blur-3xl animate-pulse-scale" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
  </div>
);

// Add these animations to your global CSS or Tailwind config
export const backgroundAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-scale {
  animation: pulse-scale 4s ease-in-out infinite;
}
`;
