'use client'

import React, {useState} from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Dialog } from 'primereact/dialog'

const options = { 
    dragFree: true, 
    loop: false
}

const NewsSectionMiniCarousel = ({images}) => {

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({delay: 1500})])
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <section className="news-section-mini-carousel">
      <div className="news-section-mini-carousel__viewport" ref={emblaRef}>
        <div className="news-section-mini-carousel__container">
          {images.map((img, index) => (
            <div className="news-section-mini-carousel__slide" key={index}>
                <img 
                    src={img} 
                    alt='News image' 
                    className="news-section-mini-carousel__slide__img"
                    onClick={() => {
                        setSelectedImage(img);
                        setViewDialog(true);
                    }}    
                ></img>
            </div>
          ))}
        </div>
      </div>
      <Dialog 
        className='news-section-mini-carousel__dialog' 
        header="" 
        visible={viewDialog} 
        draggable={false} 
        onHide={() => setViewDialog(false)} 
        resizable={false}
      > 
        <img src={selectedImage} alt='News image' className='news-section-mini-carousel__dialog__image'></img>
      </Dialog >
    </section>
  )
}

export default NewsSectionMiniCarousel
