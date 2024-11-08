import React from 'react';
import {Construction} from 'lucide-react';

const WorkingScreen = ({dict}) => {

    return (
        <div className='working-screen loading-screen'>
            <Construction color={'#f5c3a9'} size={80} />
            <h2>{dict.workingPageTitle}</h2>
            <p>{dict.workingPageDescription}</p>
        </div>
    );
};

export default WorkingScreen;
