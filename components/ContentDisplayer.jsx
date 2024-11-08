'use client'

import React, {useState} from 'react';
import Button from './Button';
import LandingPageVideos from './content-displayers/LandingPageVideos';
import LandingPagePodcasts from './content-displayers/LandingPagePodcasts';

const ContentDiplayer = ({dict}) => {

    const [selectedContent, setSelectedContent] = useState(1);
    const contentButtons = [
        {
            id: 1,
            label: dict.contentName1,
            icon: 'Clapperboard',
        },
        {
            id: 2,
            label: dict.contentName2,
            icon: 'Mic',
        },
        {
            id: 3,
            label: dict.contentName3,
            icon: 'BookOpenText',
        },
        {
            id: 4,
            label: dict.contentName4,
            icon: 'Lightbulb',
        },
    ]


    const renderContent = () => {
        switch (selectedContent) {
            case 1:
                return <LandingPageVideos />;
            case 2:
                return <LandingPagePodcasts />;
            case 3:
                return <div>3</div>;
            default:
                return <div>4</div>;
        }
    };

    return (
        <div className='content-displayer'>
            <div className='content-displayer__buttons'>
                {contentButtons.map((button, index) => (
                    <Button 
                        onClick={
                            () => {
                                if(button.id === 1 || button.id === 2){ // Temporarily disable revista and talleres
                                    setSelectedContent(button.id); 
                                }
                            }
                        } 
                        actionType='function'
                        key={index} 
                        label={button.label} 
                        icon={button.icon} 
                        iconColor={selectedContent === button.id ? '#f58521' : 'white'}
                        className={`content-displayer__button${selectedContent === button.id ? '--active' : ''}`}
                    />
                ))}
            </div>
            {renderContent()}
        </div>
    );
};

export default ContentDiplayer;
