'use client'

import React, {useState} from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Dialog } from 'primereact/dialog'
import Image from '@/components/Image';

const options = { 
    dragFree: true, 
    loop: false
}

const NewsSectionMiniCarousel = ({images, onRemoveImage}) => {

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({delay: 1500})])
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <section className="news-section-mini-carousel">
      <div className="news-section-mini-carousel__viewport" ref={emblaRef}>
        <div className="news-section-mini-carousel__container">
          {images.map((img, index) => (
            <div className="news-section-mini-carousel__slide" key={index}>
                {typeof onRemoveImage === 'function' ? (
                  <button
                    type="button"
                    className="news-section-mini-carousel__remove-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveImage(index);
                    }}
                    aria-label="Eliminar imagen"
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                ) : null}
                <Image 
                    srcWebp={img} 
                    srcJpg={img?.replace('.webp', '.jpg')} 
                    alt='News image' 
                    className="news-section-mini-carousel__slide__img"
                    onClick={() => {
                        setSelectedImage(img);
                        setViewDialog(true);
                    }}    
                ></Image>
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
