import { MutableRefObject, useEffect, useRef, useState } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {

  return (
    <section
      className="w-full min-h-screen relative select-none flex flex-col overflow-hidden"
      id="About"
    >
      {/* Base background gradient - Custom radial gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(69.22% 164.52% at 45.44% 93.28%, #0A2537 23.56%, #020B24 61.78%, #02111E 100%)'
        }}
      ></div>

      {/* Background radial gradient with color-dodge blend mode */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(79.06% 79.06% at 50% 50%, rgba(197, 214, 228, 0.5) 0%, rgba(1, 4, 8, 0.5) 100%)',
          mixBlendMode: 'color-dodge'
        }}
      ></div>

      {/* Top section with logo - positioned lower */}
      <div className="relative z-50 text-center px-4 max-w-4xl mx-auto pt-32 pb-8">
        <div className="hero-logo mb-8">
          <img
            src="/logo/historyPortal_darkMode.svg"
            alt="History Portal Logo"
            className="mx-auto h-24 md:h-32 lg:h-40 w-auto"
          />
        </div>
      </div>

      {/* Bottom Fade-out Gradient - Fades wheel to almost black */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: '20vh',
          background: 'linear-gradient(to bottom, transparent 0%, #02111E 100%)'
        }}
      ></div>

      {/* Foreground Gradient Overlay - Above rotating images */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(180.83deg, rgba(2, 82, 95, 0) 44.04%, rgba(6, 15, 39, 0.5) 71.8%, #000000 95.02%)'
        }}
      ></div>

      {/* Bottom text section - positioned above the wheel */}
      <div className="relative z-50 text-center px-4 max-w-4xl mx-auto mt-auto mb-20">
        <div className="hero-description mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            AI-Powered Lesson Builder for History Teachers
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed text-bluelight text-md">
            An innovative web-based tool integrating Google Scholar, storytelling, gamification, and flow-state principles to transform history education
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;