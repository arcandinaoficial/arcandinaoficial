'use client'

import React, {useRef} from 'react'
import Button from '../Button'
import Image from 'next/image'
import Flipbook from '@/components/Flipbook'
import revistaPages from '@/data/revista/rotary-revista.json'

const LandingPageRevista = ({dict}) => {

    const flipbookRef = useRef(null);

    const openFlipbook = () => {
        if (flipbookRef.current) {
            flipbookRef.current?.open();
        }
    };

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
                            actionType='function'
                            onClick={openFlipbook}
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
            <Flipbook ref={flipbookRef} pages={revistaPages.pages || []}/>
        </section>
    )
}

export default LandingPageRevista

