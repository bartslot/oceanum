import { MutableRefObject, useEffect, useRef, useState } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const imagesRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const [radius, setRadius] = useState(400); // Default radius for SSR

  useEffect(() => {
    // Update radius based on window size
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth * 0.4, 350));
    };

    // Set initial radius
    updateRadius();

    // Add resize listener
    window.addEventListener('resize', updateRadius);

    const timeline = gsap.timeline();
    
    // Animate title
    timeline
      .from(heroRef.current.querySelector(".hero-title"), {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      })
      .from(heroRef.current.querySelector(".hero-subtitle"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
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

    // Animate circle images
    const images = imagesRef.current.querySelectorAll(".history-image");
    images.forEach((image, index) => {
      gsap.from(image, {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        delay: 0.5 + (index * 0.03),
        ease: "back.out(1.7)"
      });
    });

    // Continuous rotation animation for the image circle
    // The container rotates, but each image counter-rotates to stay upright
    const rotationTween = gsap.to(imagesRef.current, {
      rotation: 360,
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1
    });

    // Counter-rotate each image to keep them upright
    images.forEach((image) => {
      gsap.to(image, {
        rotation: -360,
        duration: 120,
        ease: Linear.easeNone,
        repeat: -1
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateRadius);
      rotationTween.kill();
    };
  }, []);

  const historicalImages = [
    // Van Gogh paintings - using Unsplash for reliable image sources
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop&crop=center", // Van Gogh style painting
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center", // Starry Night style
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=200&h=200&fit=crop&crop=center", // Sunflowers style
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=center", // Impressionist painting
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center", // Post-impressionist art
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop&crop=center", // Classic painting
    
    // Colosseum and Roman architecture
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&h=200&fit=crop&crop=center", // Colosseum exterior
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=200&h=200&fit=crop&crop=center", // Colosseum interior
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=200&h=200&fit=crop&crop=center", // Roman Forum
    "https://images.unsplash.com/photo-1548585744-c5b8b1b5b3c5?w=200&h=200&fit=crop&crop=center", // Roman ruins
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=200&h=200&fit=crop&crop=center", // Ancient Roman architecture
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&h=200&fit=crop&crop=center", // Roman amphitheater
    
    // Additional historical content
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=200&h=200&fit=crop&crop=center", // Ancient architecture
    "https://images.unsplash.com/photo-1548585744-c5b8b1b5b3c5?w=200&h=200&fit=crop&crop=center", // Ancient ruins
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop&crop=center", // Historical building
    "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=200&h=200&fit=crop&crop=center", // Castle
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=center", // Ancient temple
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop&crop=center", // Monument
    "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=200&h=200&fit=crop&crop=center", // Historical site
    "https://images.unsplash.com/photo-1548585744-c5b8b1b5b3c5?w=200&h=200&fit=crop&crop=center", // Ancient artifact
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center", // Historical painting
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop&crop=center", // Ancient sculpture
    "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=200&h=200&fit=crop&crop=center", // Medieval castle
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop&crop=center", // Ancient city
  ];

  return (
    <section 
      className="w-full min-h-screen relative select-none flex items-center justify-center overflow-hidden"
      id="home"
      ref={heroRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>
      
      {/* Full circle of historical images */}
      <div 
        ref={imagesRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: 'center center' }}
      >
        <div 
          className="relative"
          style={{ 
            width: `${radius * 2}px`, 
            height: `${radius * 2}px`,
          }}
        >
          {historicalImages.map((image, index) => {
            // Create full circle - 360 degrees evenly distributed
            const totalImages = historicalImages.length;
            const angleStep = 360 / totalImages; // Divide 360 degrees evenly
            const angle = index * angleStep; // Start from 0° and go around
            
            // Calculate position on the circle
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="history-image absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20"
                style={{
                  left: `calc(50% + ${x}px - 2rem)`,
                  top: `calc(50% + ${y}px - 2rem)`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a colored placeholder if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold';
                      fallback.textContent = `H${index + 1}`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Foreground gradient mask - creates depth by fading bottom portion */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, rgba(30, 58, 138, 1) 0%, rgba(30, 58, 138, 0.8) 8%, transparent 15%)'
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <div className="hero-title">
          <h2 className="text-lg md:text-xl text-gray-300 mb-2">the</h2>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
            History
          </h1>
          <h2 className="hero-subtitle text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-12">
            portal
          </h2>
        </div>

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
    </section>
  );
};

export default Hero;