'use client'

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import carouselData from '@/data/curvy-carousel-slides.json';

const options = { 
    dragFree: false, 
    loop: false,
    align: 'start', // Ensure alignment to the center
}

const slides = carouselData;

const CurvyCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [middleSlideIndex, setMiddleSlideIndex] = useState(3);

    useEffect(() => {
        const updateNumberOfSlides = () => {
            if (window.innerWidth <= 480) {
                setMiddleSlideIndex(1);
            } else if (window.innerWidth <= 768){
                setMiddleSlideIndex(2); 
            } else {
                setMiddleSlideIndex(3);
            }
        };

        // Initial check
        updateNumberOfSlides();

        // Add event listener for window resize to keep updating on changes
        window.addEventListener('resize', updateNumberOfSlides);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateNumberOfSlides);
        };
    }, []); // Effect runs only once on mount but listens for resize changes
    
    useEffect(() => {
        if (!emblaApi) return;
    
        const updateSlideStyles = () => {
            const slides = emblaApi.slideNodes();
            const slidesInView = emblaApi.slidesInView(); // Get the visible slides (indices)
    
            slides.forEach((slide, index) => {
                slide.style.transform = "scaleY(1) rotateY(0deg)"; // Reset all slides to default
    
                if (slidesInView.includes(index)) {
                    // Calculate the distance from the center for the visible slides only
                    let distanceFromCenter = index - slidesInView[middleSlideIndex];
                    const firstAngle = '30deg';
                    const secondAngle = '40deg';
                    const thirdAngle = '50deg';

                    const firstScaleY = '0.7';
                    const secondScaleY = '0.75';
                    const thirdScaleY = '0.85';
    
                    // Apply transformations only to the visible slides
                    if (distanceFromCenter === 0) {
                        slide.style.transform = `scaleY(${firstScaleY}) scaleX(1) rotateY(0deg)`; // Center slide
                    } else if (distanceFromCenter === 1) {
                        slide.style.transform = `scaleY(${secondScaleY}) scaleX(1) rotateY(-${firstAngle})`; // Slide to the left
                    } else if (distanceFromCenter === -1) {
                        slide.style.transform = `scaleY(${secondScaleY}) scaleX(1) rotateY(${firstAngle})`; // Slide to the right
                    } else if (distanceFromCenter === 2) {
                        slide.style.transform = `scaleY(${thirdScaleY}) scaleX(1) rotateY(-${secondAngle})`; // Slide further left
                    } else if (distanceFromCenter === -2) {
                        slide.style.transform = `scaleY(${thirdScaleY}) scaleX(1) rotateY(${secondAngle})`; // Slide further right
                    } else if (distanceFromCenter === 3) {
                        slide.style.transform = `scaleY(1) scaleX(1.1) rotateY(-${thirdAngle})`; // Far left
                    } else if (distanceFromCenter === -3) {
                        slide.style.transform = `scaleY(1) scaleX(1.1) rotateY(${thirdAngle})`; // Far right
                    }
                }
            });
        };
    
        // Track the slide changes continuously on scroll
        emblaApi.on('scroll', updateSlideStyles);
    
        // Initialize styles immediately
        updateSlideStyles();
    
        // Cleanup listeners when the component is unmounted
        return () => {
            emblaApi.off('scroll', updateSlideStyles);
        };
    }, [emblaApi, middleSlideIndex]);
    
    return (
        <div className="curvy-carousel-container">
            <div className="curvy-carousel">
                <div className="curvy-carousel__viewport" ref={emblaRef}>
                    <div className="curvy-carousel__container">
                        {slides.map((slide, index) => (
                            <div
                                className="curvy-carousel__slide"
                                key={index}
                            >
                                <img
                                    className="curvy-carousel__slide__img"
                                    src={slide.src}
                                    alt={slide.title}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurvyCarousel;
