'use client';

import React, { useImperativeHandle, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from "react-pageflip";
import { Dialog } from 'primereact/dialog';

const Flipbook = forwardRef(({ pages }, ref) => {
    const aspectRatio = 1.4179; // Define the aspect ratio (landscape default)
    const [visible, setVisible] = useState(false);
    const [flipbookHeight, setFlipbookHeight] = useState(0);
    const [flipbookWidth, setFlipbookWidth] = useState(flipbookHeight / aspectRatio);
    const [isPortrait, setIsPortrait] = useState(false);

    // Expose the setVisible method to the parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    const updateFlipbookDimensions = () => {
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;

        // Set height to 80% of the viewport height
        let height = Math.round(screenHeight * 0.9);
        let width = Math.round(height / aspectRatio);

        // If width exceeds the screen width, adjust dimensions
        if(screenWidth < 768){
            if (width > screenWidth * 0.9) { // Allow a maximum width of 90% of the screen width
                width = Math.round(screenWidth * 0.9);
                height = Math.round(width * aspectRatio); // Recalculate height based on aspect ratio
            }
        } else{
            if ((width * 2)  > screenWidth * 0.9) { // Allow a maximum width of 90% of the screen width
                width = Math.round(screenWidth * 0.9 / 2);
                height = Math.round(width * aspectRatio); // Recalculate height based on aspect ratio
            }
        }
        

        setFlipbookHeight(height);
        setFlipbookWidth(width);

        // Switch to portrait mode if screen width is below 768px
        setIsPortrait(screenWidth < 768);
    };

    useEffect(() => {
        // Initial dimensions calculation
        updateFlipbookDimensions();

        // Listen for resize events
        window.addEventListener('resize', updateFlipbookDimensions);

        return () => {
            window.removeEventListener('resize', updateFlipbookDimensions);
        };
    }, []);

    useEffect(() => {
        if (visible) {
            document.documentElement.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
        }
    }, [visible]);

    return (
        <Dialog
            className='flipbook__dialog'
            header=""
            visible={visible}
            draggable={false}
            onHide={() => setVisible(false)}
            resizable={false}
        >
            <div className='flipbook__container'>
                <HTMLFlipBook
                    width={flipbookWidth}
                    height={flipbookHeight}
                    showCover={true}
                    drawShadow={true}
                    flippingTime={1000}
                    className='flipbook__book'
                    usePortrait={isPortrait}
                >
                    {pages.map((src, index) => (
                        <div key={index} className="page">
                            <img
                                src={src}
                                alt={`Page ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Ensure images fit nicely
                                }}
                            />
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>
        </Dialog>
    );
});

Flipbook.displayName = 'Flipbook';

export default Flipbook;
