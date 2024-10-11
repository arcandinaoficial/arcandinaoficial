'use client'

import React, {useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'; 
import {PrevButton,NextButton,usePrevNextButtons} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import carouselData from '@/data/window-carousel-slides.json';

const options = { 
    dragFree: false, 
    loop: true 
}
const TWEEN_FACTOR_BASE = 0.2

const WindowCarousel = () => {
    
    const pathname = usePathname();
    const [lang, setLang] = useState('es'); 
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (pathname.startsWith('/es')) {
            setLang('es');
        } else if (pathname.startsWith('/en') || pathname === '/') {
            setLang('en');
        } 
    }, []);

    useEffect(() => {
        setSlides(carouselData[lang] || []);
    }, [lang]);
    
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    const tweenFactor = useRef(0)
    const tweenNodes = useRef([])

    const updateCurrentIndex = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        updateCurrentIndex();
        emblaApi.on('select', updateCurrentIndex);

        return () => {
            emblaApi.off('select', updateCurrentIndex);
        };
    }, [emblaApi, updateCurrentIndex]);

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
    
        const resetOrStop =
          autoplay.options.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop
    
        resetOrStop()
    }, [])

    const setTweenNodes = useCallback((emblaApi) => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector('.carousel__parallax__layer')
        })
    }, [])

    const setTweenFactor = useCallback((emblaApi) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, [])

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
    }, [])

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
    }, [emblaApi, tweenParallax])

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick)

    const renderSlides = () => {
        if (slides.length === 0) {
            return Array.from({ length: 5 }).map((_, index) => (
                <div className="carousel__slide" key={`placeholder-${index}`}>
                    <Image
                        className='carousel__slide__window'
                        src={'/window-carousel/boat-window.png'}
                        alt={'Marco de imagen con forma de ventana de bote'}
                        width={450}
                        height={450}
                        priority 
                    />
                    <div className="carousel__parallax">
                        <div className="carousel__parallax__layer">
                            <Image
                                className='carousel__slide__img carousel__parallax__img'
                                src={'/window-carousel/placeholder-img.png'}
                                alt={'Marcador de posición de Arcandina'}
                                width={500}
                                height={500}
                                priority 
                            />
                        </div>
                    </div>
                </div>
            ));
        }

        return slides.map((slide, index) => (
            <div className="carousel__slide" key={index}>
                <Image
                    className='carousel__slide__window'
                    src={'/window-carousel/boat-window.png'}
                    alt={'Marco de imagen con forma de ventana de bote'}
                    width={450}
                    height={450}
                    priority 
                />
                <div className="carousel__parallax">
                    <div className="carousel__parallax__layer">
                        <img
                            className="carousel__slide__img carousel__parallax__img"
                            src={slide.src}  
                            alt={slide.title} 
                        />
                    </div>
                </div>
            </div>
        ));
    };

  return (
    <div className="carousel">
        <div className='carousel__image-section'>
            <div className="carousel__viewport" ref={emblaRef}>
                <div className="carousel__container">
                    {renderSlides()}
                </div>
            </div>

            <div className="carousel__buttons">
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
        </div>
        <div className="carousel__slide-details">
            <h4>{slides[currentIndex]?.title}</h4>
            <p>{slides[currentIndex]?.description}</p>
        </div>
    </div>
  )
}

export default WindowCarousel;
