'use client'

import React, {useRef} from 'react'
import Button from '../Button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Image from '@/components/Image'
import Flipbook from '@/components/Flipbook'
import revistaPages from '@/data/revista/rotary-revista.json'

const LandingPageRevista = ({dict}) => {

    const flipbookRef = useRef(null);

    const openFlipbook = () => {
        if (flipbookRef.current) {
            flipbookRef.current?.open();
        }
    };

    const handleRevistaDownload = () => {
        const link = document.createElement('a');
        link.href = '/revista/Revista - A Bordo del Arcandina.pdf'; // Path to the PDF in the public folder
        link.download = 'Revista - A Bordo del Arcandina.pdf'; // Default file name for the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const accept = () => {
        handleRevistaDownload();
    };

    const reject = () => {
        //TODO;
    };

    const showTemplate = () => {
        confirmDialog({
            group: 'templating',
            header: dict.revistaDownloadTermsTitle,
            message: (
                <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                    <i className="pi pi-exclamation-circle"></i>
                    <span className='confirm-dialog__text'>{dict.revistaDownloadTermsDescription}</span>
                </div>
            ),
            accept,
            reject
        });
    };
    

    return (
        <section className="content-displayer__revista">
            <ConfirmDialog 
            className='confirm-dialog' 
            group="templating" 
            acceptLabel={dict.toasts.revistaDownloadAccept} 
            rejectLabel={dict.toasts.revistaDownloadReject}
            acceptClassName={'button button--primary'}
            rejectClassName={'button button--transparent'}
            />
            <div className='content-displayer__revista__container'>
                <div className='content-displayer__revista__info'>
                    <div className='content-displayer__revista__cover'>
                        <Image
                            className='content-displayer__revista__cover__image'
                            srcWebp="/revista-cover.webp" 
                            srcPng="/revista-cover.png" 
                            alt="Portada de la revista A bordo del Arcandina"
                            width={800} 
                            height={800} 
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
                        <Button 
                            actionType='function'
                            onClick={() => showTemplate()}
                            label={dict.revistaButtonDownload}
                            icon='Download'
                            variable='secondary'
                        />
                    </div>
                </div>
                <div className='content-displayer__revista__image'>
                    <Image
                        className='content-displayer__revista__image__image'
                        srcWebp="/revista-image.webp" 
                        srcPng="/revista-image.png" 
                        alt="Imagen de una parte de la revista A bordo del Arcandina"
                        width={800} 
                        height={800} 
                    />
                </div>
            </div>
            <Flipbook ref={flipbookRef} pages={revistaPages.pages || []}/>
        </section>
    )
}

export default LandingPageRevista

