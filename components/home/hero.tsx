import { MutableRefObject, useEffect, useRef, useState } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const wheelRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const rotationTween = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastRotation, setLastRotation] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  
  // Heavy wheel physics state
  const [velocity, setVelocity] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastDragX, setLastDragX] = useState(0);
  const momentumTween = useRef(null);

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
    if (isDragging) return; // Don't change rotation behavior while dragging
    
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

  // Resume automatic rotation from current position
  const resumeAutomaticRotation = () => {
    if (!isHovered && rotationTween.current) {
      rotationTween.current.kill();
      
      // Start new rotation from current position
      rotationTween.current = gsap.to(wheelRef.current, {
        rotation: currentRotation + 360,
        duration: 120,
        ease: Linear.easeNone,
        repeat: -1,
        onUpdate: function() {
          // Keep track of the current rotation during automatic rotation
          setCurrentRotation(gsap.getProperty(wheelRef.current, "rotation") as number);
        }
      });
    }
  };

  // Apply momentum after drag ends
  const applyMomentum = () => {
    if (Math.abs(velocity) < 0.1) {
      // Resume automatic rotation from current position
      resumeAutomaticRotation();
      return;
    }
    
    // Kill any existing momentum
    if (momentumTween.current) {
      momentumTween.current.kill();
    }
    
    // Calculate momentum duration based on velocity (heavier = longer momentum)
    const momentumDuration = Math.min(Math.abs(velocity) * 3, 8); // Max 8 seconds
    const momentumRotation = velocity * momentumDuration * 60; // Heavy momentum
    
    momentumTween.current = gsap.to({}, {
      duration: momentumDuration,
      ease: "power3.out", // Heavy deceleration
      onUpdate: function() {
        const progress = this.progress();
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentMomentumRotation = currentRotation + (momentumRotation * easeProgress);
        
        setCurrentRotation(currentMomentumRotation);
        gsap.set(wheelRef.current, {
          rotation: currentMomentumRotation
        });
      },
      onComplete: () => {
        setVelocity(0);
        // Resume automatic rotation from final position
        resumeAutomaticRotation();
      }
    });
  };

  // Enhanced hover effect with neighboring scaling and z-index hierarchy
  const handleCardHover = (index, isEntering) => {
    if (isDragging) return; // Don't trigger hover effects while dragging
    
    const cards = wheelRef.current.querySelectorAll(".wheel-card");
    const totalCards = cards.length;
    
    if (isEntering) {
      setHoveredIndex(index);
      
      // Scale the hovered card and its neighbors with z-index hierarchy
      cards.forEach((card, cardIndex) => {
        const distance = Math.min(
          Math.abs(cardIndex - index),
          Math.abs(cardIndex - index + totalCards),
          Math.abs(cardIndex - index - totalCards)
        );
        
        let scale = 1;
        let zIndex = 1;
        
        if (distance === 0) {
          // Hovered card - biggest with highest z-index
          scale = 1.2;
          zIndex = 20;
        } else if (distance === 1) {
          // Adjacent cards - medium with medium z-index
          scale = 1.15;
          zIndex = 10;
        } else if (distance === 2) {
          // Second neighbors - small with low z-index
          scale = 1.08;
          zIndex = 5;
        } else {
          // All other cards - normal with base z-index
          scale = .9;
          zIndex = 1;
        }
        
        gsap.to(card, {
          scale: scale,
          duration: 0.4,
          ease: "power2.out"
        });
        
        // Set z-index for proper layering
        card.style.zIndex = zIndex.toString();
      });
    } else {
      setHoveredIndex(-1);
      
      // Reset all cards
      cards.forEach((card) => {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        
        // Reset z-index to base level
        card.style.zIndex = '1';
      });
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setLastDragX(e.clientX);
    setLastRotation(currentRotation);
    setLastDragTime(Date.now());
    setVelocity(0);
    
    // Reset any hover effects when starting to drag
    setHoveredIndex(-1);
    const cards = wheelRef.current.querySelectorAll(".wheel-card");
    cards.forEach((card) => {
      gsap.to(card, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
      card.style.zIndex = '1';
    });
    
    // Stop both momentum and automatic rotation
    if (momentumTween.current) {
      momentumTween.current.kill();
    }
    if (rotationTween.current) {
      rotationTween.current.kill();
    }
    
    // Change cursor to grabbing
    document.body.style.cursor = 'grabbing';
    
    // Prevent text selection
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentTime = Date.now();
    const deltaX = e.clientX - lastDragX;
    const deltaTime = currentTime - lastDragTime;
    
    // Much reduced sensitivity for heavy feel (0.1 instead of 0.5)
    const rotationDelta = deltaX * 0.1;
    const newRotation = currentRotation + rotationDelta;
    
    // Calculate velocity for momentum (pixels per millisecond)
    if (deltaTime > 0) {
      const newVelocity = deltaX / deltaTime;
      setVelocity(newVelocity * 0.3); // Reduce velocity for heavier feel
    }
    
    setCurrentRotation(newRotation);
    setLastDragX(e.clientX);
    setLastDragTime(currentTime);
    
    // Apply rotation with heavy easing
    gsap.to(wheelRef.current, {
      rotation: newRotation,
      duration: 0.3, // Slower response for heavy feel
      ease: "power2.out"
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = 'auto';
    
    // Apply momentum based on final velocity
    applyMomentum();
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStartX(touch.clientX);
    setLastDragX(touch.clientX);
    setLastRotation(currentRotation);
    setLastDragTime(Date.now());
    setVelocity(0);
    
    // Reset any hover effects when starting to drag
    setHoveredIndex(-1);
    const cards = wheelRef.current.querySelectorAll(".wheel-card");
    cards.forEach((card) => {
      gsap.to(card, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
      card.style.zIndex = '1';
    });
    
    if (momentumTween.current) {
      momentumTween.current.kill();
    }
    if (rotationTween.current) {
      rotationTween.current.kill();
    }
    
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaX = touch.clientX - lastDragX;
    const deltaTime = currentTime - lastDragTime;
    
    // Heavy wheel sensitivity
    const rotationDelta = deltaX * 0.1;
    const newRotation = currentRotation + rotationDelta;
    
    if (deltaTime > 0) {
      const newVelocity = deltaX / deltaTime;
      setVelocity(newVelocity * 0.3);
    }
    
    setCurrentRotation(newRotation);
    setLastDragX(touch.clientX);
    setLastDragTime(currentTime);
    
    gsap.to(wheelRef.current, {
      rotation: newRotation,
      duration: 0.3,
      ease: "power2.out"
    });
    
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    applyMomentum();
  };

  // Add global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e) => handleTouchMove(e);
    const handleGlobalTouchEnd = () => handleTouchEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, lastDragX, lastDragTime, currentRotation, isHovered]);

  // Historical images - 30 curated historical images
  const historicalImages = [
    "/history/1history.jpg",
    "/history/2history.jpg",
    "/history/3history.jpg",
    "/history/4history.jpg",
    "/history/5history.jpg",
    "/history/6history.jpg",
    "/history/7history.jpg",
    "/history/8history.jpg",
    "/history/9history.jpg",
    "/history/10history.jpg",
    "/history/11history.jpg",
    "/history/12history.jpg",
    "/history/13history.jpg",
    "/history/14history.jpg",
    "/history/15history.jpg",
    "/history/16history.jpg",
    "/history/17history.jpg",
    "/history/18history.jpg",
    "/history/19history.jpg",
    "/history/20history.jpg",
    "/history/21history.jpg",
    "/history/22history.jpg",
    "/history/23history.jpg",
    "/history/24history.jpg",
    "/history/25history.jpg",
    "/history/26history.jpg",
    "/history/27history.jpg",
    "/history/28history.jpg",
    "/history/29history.jpg",
    "/history/30history.jpg",
    "/history/31history.jpg",
    "/history/32history.jpg",
    "/history/33history.jpg",
    "/history/34history.jpg",
    "/history/35history.jpg",
    "/history/36history.jpg"
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
      <div className="relative z-50 text-center px-4 max-w-4xl mx-auto pt-32 pb-8">
        <div className="hero-logo mb-8">
          <img 
            src="/logo/historyPortal_darkMode.svg" 
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
            height: '1400px', // Increased from 1200px
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseEnter={() => handleWheelHover(true)}
          onMouseLeave={() => handleWheelHover(false)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
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
                  width: '130px', // Slightly increased from 120px
                  height: '130px', // Slightly increased from 120px
                  left: `calc(50% + ${x}px - 65px)`, // Adjusted for new size (130/2 = 65)
                  top: `calc(50% + ${y}px - 65px)`, // Adjusted for new size (130/2 = 65)
                  transform: `rotate(${imageRotation}deg)`,
                  willChange: 'transform',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  pointerEvents: isDragging ? 'none' : 'auto', // Disable individual hover during drag
                  zIndex: 1 // Base z-index
                }}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                  draggable={false} // Prevent image dragging
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
          <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontSize: '30pt', fontWeight: '600' }}>
            History is taught here
          </h3>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#7C9DB4', fontSize: '1em' }}>
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
            classes="inline-flex items-center justify-center px-6 py-3 font-semibold"
            style={{ fontSize: '1em' }}
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