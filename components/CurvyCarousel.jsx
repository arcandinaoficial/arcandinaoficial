'use client'

import React, { useEffect, useState, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import carouselData from '@/data/curvy-carousel-slides.json';
import { motion } from 'framer-motion';

const options = { 
    dragFree: false, 
    loop: false,
    align: 'start', // Ensure alignment to the center
}

const slides = carouselData;

const CurvyCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [middleSlideIndex, setMiddleSlideIndex] = useState(3);
    const [inView, setInView] = useState(false); // Tracks if the carousel is in view
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const isVisible = entry.isIntersecting;
            setInView(isVisible);
    
            // Re-initialize slide styles and auto-scroll only when the carousel is in view
            if (isVisible && emblaApi) {
                emblaApi.reInit();
                emblaApi.on('scroll', updateSlideStyles); // Reattach listener
                updateSlideStyles(); // Update styles immediately when in view
            } else if (!isVisible && emblaApi) {
                emblaApi.off('scroll', updateSlideStyles); // Detach listener to avoid unnecessary updates
            }
        }, { threshold: 0.35 });
    
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
    
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            if (emblaApi) {
                emblaApi.off('scroll', updateSlideStyles); // Clean up listener
            }
        };
    }, [emblaApi, inView]);
        

    // Set the middleSlideIndex based on screen size
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
                const thirdScaleY = '0.80';

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
                    slide.style.transform = `scaleY(0.9) scaleX(1.1) rotateY(-${thirdAngle})`; // Far left
                } else if (distanceFromCenter === -3) {
                    slide.style.transform = `scaleY(0.9) scaleX(1.1) rotateY(${thirdAngle})`; // Far right
                }
            }
        });
    };

    useEffect(() => {
        if (!emblaApi) return;

        // Track the slide changes continuously on scroll
        emblaApi.on('scroll', updateSlideStyles);
    
        // Initialize styles immediately
        updateSlideStyles();
    
        // Cleanup listeners when the component is unmounted
        return () => {
            emblaApi.off('scroll', updateSlideStyles);
        };
    }, [emblaApi, middleSlideIndex, inView]);

    // Automatically scroll the carousel
    useEffect(() => {
        if (!emblaApi) return;
    
        const autoScroll = setInterval(() => {
            if (emblaApi) {
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext(); // Scroll to the next slide if possible
                } else {
                    emblaApi.scrollTo(0); // Go back to the first slide if at the last slide
                }
            }
        }, 3000); // Scroll every 3 seconds
    
        return () => clearInterval(autoScroll); // Cleanup interval on unmount
    }, [emblaApi, inView]);
    

    // Motion variants for sequential animations
    const slideVariants = {
        hidden: { opacity: 0, y: 50 }, // Start hidden and slide from below
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1, // Delay each slide by 100ms for a sequential effect
                duration: 0.2
            }
        }),
    };
    
    return (
        <div className="curvy-carousel-container" ref={containerRef}>
            <div className="curvy-carousel">
                <div className="curvy-carousel__viewport" ref={emblaRef}>
                    <div className="curvy-carousel__container">
                        {slides.map((slide, index) => (
                            <motion.div
                                className="curvy-carousel__slide"
                                key={index}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                custom={index}
                                variants={slideVariants}
                            >
                                <img
                                    className="curvy-carousel__slide__img"
                                    src={slide.src}
                                    alt={slide.title}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurvyCarousel;
