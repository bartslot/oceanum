import { MutableRefObject, useEffect, useRef } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const wheelRef: MutableRefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();
    
    // Animate title
    timeline
      .from(heroRef.current.querySelector(".hero-title"), {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      })
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
    gsap.to(wheelRef.current, {
      rotation: 360,
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1
    });

    // Counter-rotate the images to keep them upright
    gsap.to(cards, {
      rotation: -360,
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1
    });

  }, []);

  // Historical images - 22 images for a full wheel
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
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&crop=center"
  ];

  return (
    <section 
      className="w-full min-h-screen relative select-none flex flex-col overflow-hidden"
      id="home"
      ref={heroRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>
      
      {/* Top text section */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto pt-20 pb-8">
        <div className="hero-title">
          <h2 className="text-lg md:text-xl text-gray-300 mb-2">the</h2>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
            History
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-300">
            portal
          </h2>
        </div>
      </div>

      {/* Circular Wheel Container */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div 
          ref={wheelRef}
          className="relative"
          style={{
            width: '600px',
            height: '600px'
          }}
        >
          {historicalImages.map((image, index) => {
            // Calculate position for perfect circle
            const totalImages = historicalImages.length;
            const angle = (index * 360) / totalImages;
            const radius = 250; // Distance from center
            
            // Convert angle to radians and calculate x, y positions
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={index}
                className="wheel-card absolute rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 backdrop-blur-sm"
                style={{
                  width: '80px',
                  height: '80px',
                  left: `calc(50% + ${x}px - 40px)`,
                  top: `calc(50% + ${y}px - 40px)`,
                  willChange: 'transform'
                }}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
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

      {/* Bottom text section */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto mt-auto pb-20">
        <div className="hero-description mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            History is taught here
          </h3>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none z-10"></div>
      
      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 1200px) {
          .wheel-container {
            transform: scale(0.8) !important;
          }
        }
        @media (max-width: 768px) {
          .wheel-container {
            transform: scale(0.6) !important;
          }
        }
        @media (max-width: 480px) {
          .wheel-container {
            transform: scale(0.4) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;