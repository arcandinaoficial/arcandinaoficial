import React from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../EmblaCarouselArrowButtons'
import VideoCard from '../VideoCard';
import useEmblaCarousel from 'embla-carousel-react'
import slides from '@/data/videos/rotary-miniserie.json';

const options = { align: 'start', loop: true }

const LandingPageVideos = (props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="content-displayer__videos">
        <div className="content-displayer__videos__viewport" ref={emblaRef}>
            <div className="content-displayer__videos__container">
                {slides.map((slide, index) => (
                    <div className="content-displayer__videos__slide" key={index}>
                        <VideoCard video={slide} />
                    </div>  
                ))}
            </div>
        </div>

        <div className="content-displayer__videos__controls">
            <div className="content-displayer__videos__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
        </div>
    </section>
  )
}

export default LandingPageVideos
