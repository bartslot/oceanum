import { MutableRefObject, useEffect, useRef } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const videoCardsRef: MutableRefObject<HTMLDivElement> = useRef(null);

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

    // Animate individual cards with stagger
    const cards = videoCardsRef.current.querySelectorAll(".video-card");
    gsap.fromTo(cards, 
      {
        opacity: 0,
        scale: 0,
        rotation: (index) => index * 15 // Start with varied rotations
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );

    // Continuous rotation animation for all cards
    gsap.to(cards, {
      rotation: "+=360",
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1,
      stagger: 0
    });

    // Floating animation for subtle movement
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: "+=10",
        duration: 2 + (index * 0.2),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3
      });
    });

  }, []);

  // Historical images with better quality
  const historicalImages = [
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center", // Hitler and Mussolini
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center", // Academic/Granger
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center", // Van Gogh
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop&crop=center", // Classical art
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop&crop=center", // Roman architecture
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=400&fit=crop&crop=center", // Colosseum
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=400&fit=crop&crop=center", // Ancient ruins
    "https://images.unsplash.com/photo-1548585744-c5b8b1b5b3c5?w=400&h=400&fit=crop&crop=center", // Historical building
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=400&fit=crop&crop=center", // Museum piece
    "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=400&fit=crop&crop=center", // Historical artifact
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center"  // Additional historical
  ];

  // Card positions based on your CSS (converted to responsive units)
  const cardPositions = [
    { left: '13.8%', top: '84.3%', rotation: -5.14 }, // Card 1
    { left: '17.4%', top: '68.5%', rotation: -20.31 }, // Card 2  
    { left: '24.1%', top: '53.9%', rotation: -35.8 }, // Card 3
    { left: '33.4%', top: '43.1%', rotation: -51.98 }, // Card 4
    { left: '45.4%', top: '36.8%', rotation: -74.39 }, // Card 5
    { left: '48.7%', top: '36.1%', rotation: 0 }, // Card 6 (center)
    { left: '45.4%', top: '36.8%', rotation: 15.61 }, // Card 7
    { left: '72.1%', top: '43.1%', rotation: 38.02 }, // Card 8
    { left: '81.4%', top: '53.9%', rotation: 54.2 }, // Card 9
    { left: '88.1%', top: '68.5%', rotation: 69.69 }, // Card 10
    { left: '91.7%', top: '84.3%', rotation: 85.04 }  // Card 11
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

      {/* Video Cards Container - based on your CSS positioning */}
      <div 
        ref={videoCardsRef}
        className="absolute z-20"
        style={{
          width: '1112.19px',
          height: '587px',
          left: 'calc(50% - 1112.19px/2 + 0.09px)',
          top: '346px',
          transform: 'scale(0.8)', // Scale down for better fit
          transformOrigin: 'center center'
        }}
      >
        {historicalImages.map((image, index) => {
          const position = cardPositions[index];
          if (!position) return null;
          
          return (
            <div
              key={index}
              className="video-card absolute rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/30 backdrop-blur-sm"
              style={{
                width: '115.34px',
                height: '115.34px',
                left: position.left,
                top: position.top,
                transform: `rotate(${position.rotation}deg)`,
                background: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform'
              }}
            >
              <img
                src={image}
                alt={`Historical image ${index + 1}`}
                className="w-full h-full object-cover opacity-0"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
                    const fallback = document.createElement('div');
                    fallback.className = 'absolute inset-0 flex items-center justify-center text-white text-sm font-bold';
                    fallback.textContent = `H${index + 1}`;
                    parent.appendChild(fallback);
                  }
                }}
              />
              
              {/* Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
            </div>
          );
        })}
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
          .video-cards-container {
            transform: scale(0.6) !important;
          }
        }
        @media (max-width: 768px) {
          .video-cards-container {
            transform: scale(0.4) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;