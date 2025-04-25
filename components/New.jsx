'use client'

import React, { useRef } from 'react';
import Button from '@/components/Button';
import { Toast } from 'primereact/toast';

const New = ({slide, dict, lang}) => {

    // ------------------ Setup -----------------------

    const toast = useRef(null);

    // ------------------------ Personalizable para cada noticia ----------------------------------------------

    const getButton = (slide) => {
        switch (slide.id) {
            case 'minga-fest':
                return <Button 
                    className='new__button'
                    actionType='redirect'
                    onClick={'https://mingamundialporelambiente.com/form/'}
                    label={slide.articleButtonText}
                />
            case 'cuento-infinito':
                return <Button 
                    className='new__button'
                    actionType='redirect'
                    onClick={'https://forms.gle/gRsQhUVX9bE7BiWu8'}
                    label={slide.articleButtonText}
                />
            default: return <></>
        }
    }

    const handleCopyToClipboardLink = () => {
        const url = `https://arcandinaoficial.org/${lang}?new=${slide.id}`;

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(url)
            .then(() => {
                // Show success message
                toast.current.show({
                    severity: 'success',
                    summary: dict.toasts.shareNewTitle,
                    detail: dict.toasts.shareNewDescription,
                });
            })
            .catch((err) => {
                toast.current.show({
                    severity: 'warn',
                    summary: dict.toasts.shareNewErrorTitle,
                    detail: `${dict.toasts.shareNewErrorDescription} ${url}`,
                    sticky: true
                });
            });
    };

    return (
        <article className='new' id='new-content'>
            <Toast ref={toast} appendTo={() => {document.body}}/>
            <span className='new__date'>{slide.date}</span>
            <h2 className='new__title'>{slide.articleTitle}</h2>
            <p className='new__content'>
                {slide.articleParagraphs?.map((par, index) => (
                    <span className="new__paragraph" key={index}>
                        {par}
                    </span>
                )) || <></>}
            </p>
            <div className='new__footer'>
                {
                    slide.hasArticleButton && getButton(slide)
                }
                <Button 
                    variable={slide.hasArticleButton ? 'transparent' : 'primary'}
                    label={dict.shareNewButton}
                    actionType='function'
                    onClick={handleCopyToClipboardLink}
                    icon='Share2'
                    iconColor={slide.hasArticleButton ? '#f58521' : '#faf9f6'}
                    className='new__footer__share-btn'
                /> 
            </div>
        </article>
    );
};

export default New;
