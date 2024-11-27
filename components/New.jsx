'use client'

import React from 'react';
import Button from '@/components/Button';

const New = ({slide}) => {

    // ------------------------ Personalizable para cada noticia ----------------------------------------------

    const getButton = (slide) => {
        switch (slide.id) {
            case 1:
                return <Button 
                    className='new__button'
                    actionType='function'
                    onClick={() => console.log('hola')}
                    label={slide.articleButtonText}
                />
            default: return <></>
        }
    }

    return (
        <article className='new'>
            <span className='new__date'>{slide.date}</span>
            <h2 className='new__title'>{slide.articleTitle}</h2>
            <p className='new__content'>
                {slide.articleParagraphs?.map((par, index) => (
                    <span className="new__paragraph" key={index}>
                        {par}
                    </span>
                )) || <></>}
            </p>
            {
                slide.hasArticleButton && getButton(slide)
            }
        </article>
    );
};

export default New;
