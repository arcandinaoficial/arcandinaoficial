'use client'

import Image from 'next/image';
import React, {useEffect, useState} from 'react';

const CharacterPin = ({positionX, positionY, characterName}) => {

    const [characterImage, setCharacterImage] = useState('/characters/cori.jpg');

    useEffect(()=>{
        switch(characterName){
            case 'jagui':
                setCharacterImage('/characters/jagui.png');
                return;
            case 'antonella':
                setCharacterImage('/characters/antonella.png');
                return;
            case 'tucan':
                setCharacterImage('/characters/tucan.png');
                return;
            case 'guardian':
                setCharacterImage('/characters/guardian.png');
                return;
            case 'cori':
                setCharacterImage('/characters/cori.png');
                return;
            case 'ratasura':
                setCharacterImage('/characters/ratasura.png');
                return;
            default: 
                break;
        }
    },[])

    return (
        <div className={`character-pin character-pin--${characterName}`} style={{left: `${positionX}`, top: `${positionY}`}}>
            <Image
                className='character-pin__character'
                src={characterImage} 
                alt={`Imagen de ${characterName}`}
                width={100} 
                height={100} 
                priority 
            />
        </div>
    );
};

export default CharacterPin;
