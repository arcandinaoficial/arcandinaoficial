import React from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../EmblaCarouselArrowButtons'
import VideoCard from '../VideoCard';
import useEmblaCarousel from 'embla-carousel-react'
import slides from '@/data/podcasts/rotary-podcasts.json';
import VideoCardEmpty from '../VideoCardEmpty';

const options = { align: 'start', loop: true }

const LandingPagePodcasts = ({dict}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const cutIndex = slides.findIndex(slide => slide.src === 'contentcut');
  const slidesToRender = cutIndex === -1 ? slides : slides.slice(0, cutIndex + 1);

  return (
    <section className="content-displayer__videos">
        <div className="content-displayer__videos__viewport" ref={emblaRef}>
            <div className="content-displayer__videos__container">
                {slidesToRender.map((slide, index) => (
                    <div className="content-displayer__videos__slide" key={index}>
                        {slide.src === 'contentcut' ? 
                          <VideoCardEmpty dict={dict} /> :
                          <VideoCard video={slide} className='podcast-video-card'/>
                        }
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

export default LandingPagePodcasts
