'use client'

import React, {useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import carouselData from '@/data/curvy-carousel-slides.json';

const options = { 
    dragFree: false, 
    loop: true 
}
const TWEEN_FACTOR_BASE = 0.2
const slides = carouselData;

const CurvyCarousel = () => {
    
    // Setup
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])  // Setup Embla carousel reference and autoplay plugin
    const tweenFactor = useRef(0) // Reference to keep track of tween factor and nodes for parallax effect
    const tweenNodes = useRef([]) // Reference to keep track of tween factor and nodes for parallax effect

    // Effects    
    // Embla api setup
    const setTweenNodes = useCallback((emblaApi) => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector('.curvy-carousel__parallax__layer')
        })
    }, []) // Function to set the tween nodes for parallax animation
    const setTweenFactor = useCallback((emblaApi) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, []) // Function to set the tween factor based on scroll snaps
    const tweenParallax = useCallback((emblaApi, eventName) => {
        const engine = emblaApi.internalEngine()
        const scrollProgress = emblaApi.scrollProgress()
        const slidesInView = emblaApi.slidesInView()
        const isScrollEvent = eventName === 'scroll'

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return

            if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target()

                if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress)
                }
                }
            })
            }

            const translate = diffToTarget * (-1 * tweenFactor.current) * 100
            const tweenNode = tweenNodes.current[slideIndex]
            tweenNode.style.transform = `translateX(${translate}%)`
        })
        })
    }, []) // Parallax effect function to animate slides as they scroll
    useEffect(() => {
        if (!emblaApi) return

        setTweenNodes(emblaApi)
        setTweenFactor(emblaApi)
        tweenParallax(emblaApi)

        emblaApi
        .on('reInit', setTweenNodes)
        .on('reInit', setTweenFactor)
        .on('reInit', tweenParallax)
        .on('scroll', tweenParallax)
        .on('slideFocus', tweenParallax)
    }, [emblaApi, tweenParallax])  // Effect to initialize the parallax animation and event listeners on Embla carousel

    return (
        <>
            {/* Carrusel */}
            <div className="curvy-carousel">
                <div className='curvy-carousel__image-section'>
                    <div className="curvy-carousel__viewport" ref={emblaRef}>
                        <div className="curvy-carousel__container">
                            {slides.map((slide, index) => (
                                <div className="curvy-carousel__slide" key={index}>
                                    <div className="curvy-carousel__parallax">
                                        <div className="curvy-carousel__parallax__layer">
                                            <img
                                                className="curvy-carousel__slide__img curvy-carousel__parallax__img"
                                                src={slide.src}  
                                                alt={slide.title} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default CurvyCarousel;
