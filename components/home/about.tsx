import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

// GSAP would be imported like this in your actual project:
// import { gsap } from 'gsap';

const TrendingSection = () => {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock GSAP functionality for demo
  const mockGSAP = {
    to: (element, options) => {
      if (element && element.style) {
        if (options.x !== undefined) {
          element.style.transform = `translateX(${options.x}px)`;
        }
        if (options.opacity !== undefined) {
          element.style.opacity = options.opacity;
        }
      }
    }
  };

  // Sample trending history data
  const trendingItems = [
    {
      id: 1,
      title: "The Punic Wars",
      category: "Ancient History",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Three devastating wars between Rome and Carthage that shaped the ancient Mediterranean world"
    },
    {
      id: 2,
      title: "Abraham Lincoln",
      category: "American History",
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop",
      description: "The 16th President who led America through Civil War and abolished slavery"
    },
    {
      id: 3,
      title: "Colosseum",
      category: "Roman Empire",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fb6?w=400&h=300&fit=crop",
      description: "Rome's iconic amphitheater where gladiators fought before 50,000 spectators"
    },
    {
      id: 4,
      title: "Gladiators",
      category: "Roman Culture",
      image: "https://images.unsplash.com/photo-1594736797933-d0a9ba7a1db3?w=400&h=300&fit=crop",
      description: "Professional fighters who battled in arenas for entertainment and honor in ancient Rome"
    },
    {
      id: 5,
      title: "Silk Road",
      category: "Trade Routes",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Ancient network of trade routes connecting East and West for over 1,400 years"
    }
  ];

  const nextSlide = () => {
    const maxSlide = trendingItems.length - 4; // Show 4 items at once
    if (currentSlide < maxSlide) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);

      // Mock animation
      mockGSAP.to(carouselRef.current, {
        x: -newSlide * 280 // Card width + gap
      });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);

      // Mock animation
      mockGSAP.to(carouselRef.current, {
        x: -newSlide * 280
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen">
      <div className="container mx-auto px-8 max-w-7xl">

        {/* Most Popular Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-light text-blue-200 tracking-wide">
              Most popular
            </h2>

            {/* Navigation Arrow */}
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
              disabled={currentSlide >= trendingItems.length - 4}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-6 transition-transform duration-500 ease-out"
            >
              {trendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 group cursor-pointer"
                >
                  {/* Card */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border-3 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Number Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-sm border-3 border-white/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-sm text-xs font-semibold text-white border border-blue-400/50">
                          {item.category.split(' ')[0].toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Built for Better History Teaching Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-light text-blue-200 tracking-wide mb-12">
            Built for Better History Teaching
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Lessons",
                description: "Interaction energizes your class, and students will enjoy it. Using techniques that prompt students to respond in real time, attention stays high, making it easier to absorb the material.",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
                icon: "📚"
              },
              {
                title: "Engaged students",
                description: "Learning can be fun. With gamification, we make learning fun and effective. Studies show over 80% of students achieve better outcomes through gamified education.",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop",
                icon: "🎮"
              },
              {
                title: "Track progress",
                description: "Our platform lets teachers track each student's progress or see how lessons perform. Results are collected automatically and displayed in a clear dashboard.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
                icon: "📊"
              },
              {
                title: "Made for Teachers",
                description: "Creating engaging lessons is simpler than ever. Our editor helps teachers refine, adjust, and enhance content to suit their class. With AI, building new lessons is fast and easy.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
                icon: "👩‍🏫"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border-3 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <h2 className="text-5xl font-light text-white mb-6 leading-tight">
            Learning <span className="text-blue-400">through play</span>
            <br />
            places a fully <span className="text-blue-400">engaged class</span>
            <br />
            within reach.
          </h2>

          <div className="mt-12">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl border-3 border-blue-500 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
              <span>Start Teaching History</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;