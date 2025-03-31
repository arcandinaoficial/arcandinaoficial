'use client'

import React, { useState, useEffect } from 'react';
import Image from './Image';
import { Dialog } from 'primereact/dialog';

const GuideCard = ({ guide }) => {

    // --------- Estados ---------------

    const [visible, setVisible] = useState(false);
    const [guideHtml, setGuideHtml] = useState('');

    // --------- Funciones ---------------

    useEffect(() => {
        if (visible && guide?.guideSource) {
            fetch(guide.guideSource)
                .then(res => res.text())
                .then(html => setGuideHtml(html));
        }
    }, [visible, guide?.guideSource]);

    useEffect(() => {
        if (visible) {
            document.documentElement.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
        }
    }, [visible]);

    const handleOpenGuide = () => {
        setVisible(true);
    };

    return (
        <>
            <button className={`video-card guide-video-card`} onClick={handleOpenGuide}>
                <div className="video-card__thumbnail" >
                    <Image
                        srcWebp={guide?.thumbnailWebp || ''}
                        srcJpg={guide?.thumbnailJpg || ''}
                        alt={guide?.title}
                        className='video-card__thumbnail-image'
                        src={guide?.thumbnail || ''}
                        width={500}
                        height={500}
                    />
                </div>
                <h5 className="video-card__title">{guide?.title}</h5>
                <p className="video-card__description">{guide?.description}</p>
            </button>

            {/* Diálogo para poder ver el contenido de la guía */}
            <Dialog
                className='flipbook__dialog guide__dialog'
                header=""
                visible={visible}
                draggable={false}
                onHide={() => setVisible(false)}
                resizable={false}
            >
                <div className='guide' dangerouslySetInnerHTML={{ __html: guideHtml }} />
            </Dialog>
        </>
    );
};

export default GuideCard;
