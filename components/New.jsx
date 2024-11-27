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
                    actionType='redirect'
                    onClick={'https://docs.google.com/forms/d/1BCe7EdGSuZnTsXjJp6jropPXvnc-44QwMJZSDTnXF0s/edit?ts=673681ba'}
                    label={slide.articleButtonText}
                />
            default: return <></>
        }
    }

    return (
        <article className='new' id='new-content'>
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
