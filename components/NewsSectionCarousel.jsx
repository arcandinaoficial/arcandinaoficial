'use client'

import React, {useCallback, useEffect, useRef, useState } from 'react'
import {PrevButton,NextButton,usePrevNextButtons} from '@/components/EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from '@/components/EmblaCarouselDotButton'
import useEmblaCarousel from 'embla-carousel-react'
import Button from '@/components/Button'
import NewsSectionMiniCarousel from './NewsSectionMiniCarousel'
import New from './New'
import Image from '@/components/Image';

const options = { 
    dragFree: false, 
    loop: true 
}
const TWEEN_FACTOR_BASE = 0.2

const NewsSectionCarousel = ({slides, newId = null, dict, lang}) => {
    
    // Setup
    const [emblaRef, emblaApi] = useEmblaCarousel(options)  // Setup Embla carousel reference and autoplay plugin
    const tweenFactor = useRef(0) // Reference to keep track of tween factor and nodes for parallax effect
    const tweenNodes = useRef([]) // Reference to keep track of tween factor and nodes for parallax effect
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const [currentSlide, setCurrentSlide] = useState({});

    const updateCurrentSlide = useCallback(() => {
        if (!emblaApi || slides.length === 0) return;
        const index = emblaApi.selectedScrollSnap();
        setCurrentSlide(slides[index]); // Update the current slide based on the index
    }, [emblaApi, slides]);
    useEffect(() => {
        if (!emblaApi) return;

        updateCurrentSlide(); // Set the initial current slide
        emblaApi.on('select', updateCurrentSlide); // Listen for slide changes

        return () => {
            emblaApi.off('select', updateCurrentSlide); // Clean up event listener
        };
    }, [emblaApi, updateCurrentSlide]);
    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
    
        const resetOrStop =
          autoplay.options.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop
    
        resetOrStop()
    }, []) // Function to handle navigation button clicks and reset or stop autoplay
    const setTweenNodes = useCallback((emblaApi) => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector('.news-section-carousel__parallax__layer')
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
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick) // Rendering logic for the slides or placeholders when slides are not available
    useEffect(() => {
        if (emblaApi && newId) {
            const targetIndex = slides.findIndex((slide) => slide.id === newId);
            if (targetIndex !== -1) {
                emblaApi.scrollTo(targetIndex); // Scroll to the specific slide
                setCurrentSlide(slides[targetIndex]); // Set the current slide
            }
        }
    }, [emblaApi, newId, slides]); // Scroll to specific news slide if `newId` is provided

    // Component functions
    const renderSlides = () => {
        if (slides.length === 0) {
            return Array.from({ length: 5 }).map((_, index) => (
                <div className="news-section-carousel__slide" key={`placeholder-${index}`}>
                    <div className="news-section-carousel__parallax">
                        <div className="news-section-carousel__parallax__layer">
                            <div className='news-section-carousel__slide__img news-section-carousel__parallax__img'>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }

        return slides.map((slide, index) => (
            <div className="news-section-carousel__slide" key={index}>
                <div className="news-section-carousel__parallax">
                    <div className="news-section-carousel__parallax__layer">
                        <Image
                            className="news-section-carousel__slide__img news-section-carousel__parallax__img"
                            srcWebp={slide.images[0]}
                            srcJpg={slide.images[0]?.replace('.webp', '.jpg')}
                            alt={`Imagen de ${slide.articleTitle}`}
                            width={800}
                            height={600} 
                        />
                    </div>
                </div>

                <div className='news-section-carousel__outline'></div>
                <div className='news-section-carousel__text'> 
                    <h4 className='news-section-carousel__text__title'>
                        <span>{slide.bannerTitle1}</span>
                        <span>{slide.bannerTitle2}</span>
                    </h4>
                    <p className='news-section-carousel__text__description'>{slide.bannerSubtitle}</p>
                    {
                        slide.hasBannerButton && getButton(slide)
                    }
                </div>
            </div>
        ));
    }; // Renders actual slides or placeholders depending on slides state
    
    // ------------------------ Personalizable para cada noticia ----------------------------------------------

    const getButton = (slide) => {
        switch (slide.id) {
            case 'minga-fest':
                return <Button 
                    className='carousel__text__button'
                    actionType='redirect'
                    onClick={'https://mingamundialporelambiente.com/'}
                    label={slide.bannerButtonText}
                />
            default: 
                return <Button 
                    className='carousel__text__button'
                    actionType='scrollTo'
                    onClick={'new-content'}
                    label={slide.bannerButtonText}
                />
        }
    }

    return (
        <>
            {/* Carrusel */}
            <div id='JournalSection' className={`news-section-carousel ${currentSlide.className || ''}`}>
                <div className='news-section-carousel__image-section'>
                    <div className="news-section-carousel__viewport" ref={emblaRef}>
                        <div className="news-section-carousel__container">
                            {renderSlides()}
                        </div>
                    </div>

                    <div className="news-section-carousel__buttons">
                        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                    </div>

                    <div className="news-section-carousel__controls">
                        <div className="news-section-carousel__dots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'news-section-carousel__dot'.concat(
                                index === selectedIndex ? ' news-section-carousel__dot--selected' : ''
                            )}
                            />
                        ))}
                        </div>
                    </div>
                </div>
                {
                    currentSlide?.images?.length > 1 &&
                    <NewsSectionMiniCarousel images={currentSlide.images.slice(1)} />
                }
                <New slide={currentSlide || {}} dict={dict} lang={lang}/>
            </div>
        </>
        
    )
}

export default NewsSectionCarousel;
