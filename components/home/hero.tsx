import { MutableRefObject, useEffect, useRef, useState } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const wheelRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const rotationTween = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();
    
    // Animate logo and title
    timeline
      .from(heroRef.current.querySelector(".hero-logo"), {
        opacity: 0,
        y: 50,
        scale: 0.8,
        duration: 1.2,
        ease: "power2.out"
      })
      .from(heroRef.current.querySelector(".hero-subtitle"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      .from(heroRef.current.querySelector(".hero-description"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .from(heroRef.current.querySelector(".hero-button"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3");

    // Animate wheel cards with stagger
    const cards = wheelRef.current.querySelectorAll(".wheel-card");
    gsap.fromTo(cards, 
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 1,
        stagger: 0.05,
        ease: "back.out(1.7)"
      }
    );

    // Continuous rotation animation for the entire wheel
    rotationTween.current = gsap.to(wheelRef.current, {
      rotation: 360,
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1
    });

  }, []);

  // Handle wheel hover effects
  const handleWheelHover = (hovering) => {
    setIsHovered(hovering);
    
    if (hovering) {
      // Slowly decelerate to a stop
      gsap.to(rotationTween.current, {
        timeScale: 0,
        duration: 2,
        ease: "power2.out"
      });
    } else {
      // Resume normal rotation
      gsap.to(rotationTween.current, {
        timeScale: 1,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  };

  // Historical images - 25 images for a fuller wheel
  const historicalImages = [
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1548585744-c5b8b1b5b3c5?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1555400292-1a0b6b8b8b8b?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center"
  ];

  return (
    <section 
      className="w-full min-h-screen relative select-none flex flex-col overflow-hidden"
      id="home"
      ref={heroRef}
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
      <div className="relative z-50 text-center px-4 max-w-4xl mx-auto pt-24 pb-8">
        <div className="hero-logo mb-8">
          <img 
            src="/logo-custom.svg" 
            alt="History Portal Logo" 
            className="mx-auto h-24 md:h-32 lg:h-40 w-auto"
          />
        </div>
      </div>

      {/* Circular Wheel Container - Bigger and positioned at bottom center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-20">
        <div 
          ref={wheelRef}
          className="relative wheel-container"
          style={{
            width: '1400px', // Increased from 1200px
            height: '1400px' // Increased from 1200px
          }}
          onMouseEnter={() => handleWheelHover(true)}
          onMouseLeave={() => handleWheelHover(false)}
        >
          {historicalImages.map((image, index) => {
            // Calculate position for perfect circle
            const totalImages = historicalImages.length;
            const angle = (index * 360) / totalImages;
            const radius = 700; // Increased radius for bigger wheel
            
            // Convert angle to radians and calculate x, y positions
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            // Calculate individual rotation based on position
            const imageRotation = angle - 90 + 180;
            
            return (
              <div
                key={index}
                className="wheel-card absolute rounded-2xl overflow-hidden transition-all duration-500 ease-out"
                style={{
                  width: '120px', // Increased from 100px
                  height: '120px', // Increased from 100px
                  left: `calc(50% + ${x}px - 60px)`, // Adjusted for new size (120/2 = 60)
                  top: `calc(50% + ${y}px - 60px)`, // Adjusted for new size (120/2 = 60)
                  transform: `rotate(${imageRotation}deg)`,
                  willChange: 'transform',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  // Individual card hover effect - 120% scale with white shadow
                  gsap.to(e.currentTarget, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                  
                  // Add white shadow effect
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4), 0 10px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  // Reset individual card
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                  
                  // Remove white shadow effect
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                }}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
                      const fallback = document.createElement('div');
                      fallback.className = 'absolute inset-0 flex items-center justify-center text-white text-xs font-bold';
                      fallback.textContent = `${index + 1}`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
              </div>
            );
          })}
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
      <div className="relative z-50 text-center px-4 max-w-4xl mx-auto mt-auto mb-32">
        <div className="hero-description mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            History is taught here
          </h3>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#7C9DB4' }}>
            Our platform is currently in beta and invite-only.<br />
            Request an invite now to receive a link to<br />
            create your account.
          </p>
        </div>

        <div className="hero-button">
          <Button
            type="white"
            name="Join the History portal"
            href="#contact"
            classes="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold"
          />
        </div>
      </div>
      
      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 1400px) {
          .wheel-container {
            transform: scale(0.8) !important;
          }
        }
        @media (max-width: 1200px) {
          .wheel-container {
            transform: scale(0.7) !important;
          }
        }
        @media (max-width: 768px) {
          .wheel-container {
            transform: scale(0.5) !important;
          }
        }
        @media (max-width: 480px) {
          .wheel-container {
            transform: scale(0.35) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;