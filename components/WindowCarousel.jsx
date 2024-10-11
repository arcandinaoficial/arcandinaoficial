'use client'

import React, {useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'; 
import {PrevButton,NextButton,usePrevNextButtons} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import carouselData from '@/data/window-carousel-slides.json';
import { Dialog } from 'primereact/dialog';

const options = { 
    dragFree: false, 
    loop: true 
}
const TWEEN_FACTOR_BASE = 0.2

const WindowCarousel = () => {
    
    // Setup
    const pathname = usePathname(); // Pathname to get the language selected
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])  // Setup Embla carousel reference and autoplay plugin
    const tweenFactor = useRef(0) // Reference to keep track of tween factor and nodes for parallax effect
    const tweenNodes = useRef([]) // Reference to keep track of tween factor and nodes for parallax effect

    // Estados
    const [lang, setLang] = useState('es'); // Sets the language to fetch corresponding slides array
    const [slides, setSlides] = useState([]); // Stores slides to show in the carousel
    const [currentIndex, setCurrentIndex] = useState(0); // Maps the focused image
    const [visible, setVisible] = useState(false); // Toggle dialog visibility
    const [currentSlide, setCurrentSlide] = useState({});
    const [numberOfLights, setNumberOfLights] = useState(4); // State to control the number of lights

    // Effects
    useEffect(() => {
        const updateNumberOfLights = () => {
            if (window.innerWidth <= 768) {
                setNumberOfLights(3);
            } else {
                setNumberOfLights(4); // Default to 4 lights otherwise
            }
        };

        // Initial check
        updateNumberOfLights();

        // Add event listener for window resize to keep updating on changes
        window.addEventListener('resize', updateNumberOfLights);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateNumberOfLights);
        };
    }, []); // Effect runs only once on mount but listens for resize changes
    useEffect(() => {
        if (pathname.startsWith('/es')) {
            setLang('es');
        } else if (pathname.startsWith('/en') || pathname === '/') {
            setLang('en');
        } 
    }, []); // Sets the language with the current route
    useEffect(() => {
        setSlides(carouselData[lang] || []);
    }, [lang]); // Sets the corresponding slides according to the language
    
    // Embla api setup
    const updateCurrentIndex = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]); // Callback to update the current slide index in Embla
    useEffect(() => {
        if (!emblaApi) return;

        updateCurrentIndex();
        emblaApi.on('select', updateCurrentIndex);

        return () => {
            emblaApi.off('select', updateCurrentIndex);
        };
    }, [emblaApi, updateCurrentIndex]); // Effect to handle Embla carousel events
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
        return slideNode.querySelector('.carousel__parallax__layer')
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

    // Component functions
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
                    onClick={() => {setCurrentSlide(slide); setVisible(true)}}
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
    }; // Renders actual slides or placeholders depending on slides state
    useEffect(() => {
        if (visible) {
            document.documentElement.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
        }
    }, [visible]);
    

    return (
        <>
            {/* Carrusel */}
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

            {/* Diálogo de detalles */}
            <Dialog className='carousel__slide__dialog' header="" visible={visible} draggable={false} onHide={() => setVisible(false)} >
                <div className='carousel__slide__dialog__lights'>
                    {
                        Array.from({ length: numberOfLights }).map((_, index) => (
                            <small className='carousel__slide__dialog__light__container' key={index}>
                                <small className='carousel__slide__dialog__light'></small>
                            </small>
                        ))
                    }
                </div>
                
                <Image
                    className='carousel__slide__dialog__image'
                    src={currentSlide?.src}
                    alt={currentSlide?.title}
                    width={450}
                    height={450}
                />
                <div className="carousel__slide-details">
                    <h4>{currentSlide?.title}</h4>
                    <p>{currentSlide?.description}</p>
                </div>
            </Dialog>
        </>
        
    )
}

export default WindowCarousel;
