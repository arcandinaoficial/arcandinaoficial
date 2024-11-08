import React from 'react';
import {Construction} from 'lucide-react';
import Button from '@/components/Button';

const WorkingScreen = ({dict, params}) => {

    return (
        <div className='working-screen loading-screen'>
            <Construction color={'white'} size={80} />
            <h2>{dict.workingPageTitle}</h2>
            <p>{dict.workingPageDescription}</p>
            <Button 
                actionType="navigate"
                label={dict.back}
                onClick={`/${params.lang}`}
                icon='CircleArrowLeft'
            />
        </div>
    );
};

export default WorkingScreen;
