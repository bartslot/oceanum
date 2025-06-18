import { MutableRefObject, useEffect, useRef } from "react";
import { gsap, Linear } from "gsap";
import Button from "../common/button";

const Hero = () => {
  const heroRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const imagesRef: MutableRefObject<HTMLDivElement> = useRef(null);

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

    // Animate circular images
    const images = imagesRef.current.querySelectorAll(".history-image");
    images.forEach((image, index) => {
      gsap.from(image, {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        delay: 0.5 + (index * 0.1),
        ease: "back.out(1.7)"
      });
    });

    // Continuous rotation animation for the image circle
    gsap.to(imagesRef.current, {
      rotation: 360,
      duration: 60,
      ease: Linear.easeNone,
      repeat: -1
    });

  }, []);

  const historicalImages = [
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient ruins
    "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Castle
    "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical building
    "https://images.pexels.com/photos/2166557/pexels-photo-2166557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient architecture
    "https://images.pexels.com/photos/2166558/pexels-photo-2166558.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical site
    "https://images.pexels.com/photos/2166560/pexels-photo-2166560.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Monument
    "https://images.pexels.com/photos/2166561/pexels-photo-2166561.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical artifact
    "https://images.pexels.com/photos/2166562/pexels-photo-2166562.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Ancient temple
    "https://images.pexels.com/photos/2166563/pexels-photo-2166563.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1", // Historical painting
    "https://images.pexels.com/photos/2166564/pexels-photo-2166564.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1"  // Ancient sculpture
  ];

  return (
    <section 
      className="w-full min-h-screen relative select-none flex items-center justify-center"
      id="home"
      ref={heroRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>
      
      {/* Floating historical images in circle */}
      <div 
        ref={imagesRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
          {historicalImages.map((image, index) => {
            const angle = (index * 36) - 90; // 360/10 = 36 degrees between each image
            const radius = 250; // Distance from center
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="history-image absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  left: `calc(50% + ${x}px - 2rem)`,
                  top: `calc(50% + ${y}px - 2rem)`,
                  transform: `rotate(${-angle}deg)` // Counter-rotate to keep images upright
                }}
              >
                <img
                  src={image}
                  alt={`Historical image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
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
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
    </section>
  );
};

export default Hero;