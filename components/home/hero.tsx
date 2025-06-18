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
      setRadius(Math.min(window.innerWidth * 0.4, 400));
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
        delay: 0.5 + (index * 0.05),
        ease: "back.out(1.7)"
      });
    });

    // Continuous rotation animation for the image circle
    gsap.to(imagesRef.current, {
      rotation: 360,
      duration: 120,
      ease: Linear.easeNone,
      repeat: -1
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateRadius);
    };
  }, []);

  const historicalImages = [
    // Van Gogh paintings
    "https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Starry Night style
    "https://images.pexels.com/photos/1070528/pexels-photo-1070528.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Sunflowers style
    "https://images.pexels.com/photos/1070529/pexels-photo-1070529.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Van Gogh style painting
    "https://images.pexels.com/photos/1070530/pexels-photo-1070530.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Impressionist painting
    "https://images.pexels.com/photos/1070531/pexels-photo-1070531.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Post-impressionist art
    "https://images.pexels.com/photos/1070532/pexels-photo-1070532.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Classic painting
    
    // Colosseum and Roman architecture
    "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Colosseum exterior
    "https://images.pexels.com/photos/2064828/pexels-photo-2064828.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Colosseum interior
    "https://images.pexels.com/photos/2064829/pexels-photo-2064829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Roman Forum
    "https://images.pexels.com/photos/2064830/pexels-photo-2064830.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Roman ruins
    "https://images.pexels.com/photos/2064831/pexels-photo-2064831.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient Roman architecture
    "https://images.pexels.com/photos/2064832/pexels-photo-2064832.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Roman amphitheater
    
    // Additional historical content
    "https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient architecture
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient ruins
    "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical building
    "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Castle
    "https://images.pexels.com/photos/1797162/pexels-photo-1797162.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient temple
    "https://images.pexels.com/photos/1134167/pexels-photo-1134167.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Monument
    "https://images.pexels.com/photos/1797163/pexels-photo-1797163.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical site
    "https://images.pexels.com/photos/1134168/pexels-photo-1134168.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient artifact
    "https://images.pexels.com/photos/1797164/pexels-photo-1797164.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical painting
    "https://images.pexels.com/photos/1134169/pexels-photo-1134169.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient sculpture
    "https://images.pexels.com/photos/1797165/pexels-photo-1797165.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Medieval castle
    "https://images.pexels.com/photos/1134170/pexels-photo-1134170.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient city
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
      >
        <div 
          className="relative"
          style={{ 
            width: `${radius * 2}px`, 
            height: `${radius * 2}px`,
            transformOrigin: 'center center'
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
            
            // Add slight random rotation to each image for variety
            const imageRotation = (Math.random() - 0.5) * 30; // Random rotation between -15° and +15°
            
            return (
              <div
                key={index}
                className="history-image absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  left: `calc(50% + ${x}px - 2rem)`,
                  top: `calc(50% + ${y}px - 2rem)`,
                  transform: `rotate(${imageRotation}deg)`, // Apply slight rotation to the container
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.currentTarget.src = `https://via.placeholder.com/200x200/4A5568/FFFFFF?text=History+${index + 1}`;
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