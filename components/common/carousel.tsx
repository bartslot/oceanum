import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Carousel: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const cards = Array.from({ length: 5 }, (_, index) => `Card ${index + 1}`);

    useEffect(() => {
        const handleDrag = (event: MouseEvent) => {
            if (carouselRef.current) {
                gsap.to(carouselRef.current, {
                    x: event.movementX,
                    duration: 0.2,
                    ease: 'power1.out',
                });
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        const handleMouseDown = () => {
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener('mousedown', handleMouseDown);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('mousedown', handleMouseDown);
            }
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="overflow-hidden">
            <div
                ref={carouselRef}
                className="flex space-x-4 transition-transform duration-300"
                style={{ transform: 'translateX(-50%)' }}
            >
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 w-64 flex-shrink-0"
                    >
                        {card}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;