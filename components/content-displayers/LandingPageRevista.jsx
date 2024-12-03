import React from 'react'
import Button from '../Button'
import Image from 'next/image'

const LandingPageRevista = ({dict}) => {
  

  return (
    <section className="content-displayer__revista">
        <div className='content-displayer__revista__container'>
            <div className='content-displayer__revista__info'>
                <div className='content-displayer__revista__cover'>
                    <Image
                        className='content-displayer__revista__cover__image'
                        src="/revista-cover.webp" 
                        alt="Portada de la revista A bordo del Arcandina"
                        width={800} 
                        height={800} 
                        priority 
                    />
                </div>
                <div className='content-displayer__revista__text'>
                    <h6>{dict.revistaTitle}</h6>
                    <p>{dict.revistaDescription}</p>
                    <Button 
                        actionType='redirect'
                        onClick={'https://drive.google.com/file/d/11M8kjjn3Ml8pGCDavMC9dfCrfn84447j/view'}
                        label={dict.revistaButton}
                        icon='BookOpenText'
                    />
                </div>
            </div>
            <div className='content-displayer__revista__image'>
                <Image
                    className='content-displayer__revista__image__image'
                    src="/revista-image.webp" 
                    alt="Imagen de una parte de la revista A bordo del Arcandina"
                    width={800} 
                    height={800} 
                    priority 
                />
            </div>
        </div>
    </section>
  )
}

export default LandingPageRevista

