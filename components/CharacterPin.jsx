'use client'

import Image from 'next/image';
import React, {useEffect, useState} from 'react';

const CharacterPin = ({characterName, action}) => {

    const [characterImage, setCharacterImage] = useState('/characters/cori.webp');

    useEffect(()=>{
        switch(characterName){
            case 'jagui':
                setCharacterImage('/characters/jagui.webp');
                return;
            case 'antonella':
                setCharacterImage('/characters/antonella.webp');
                return;
            case 'tucan':
                setCharacterImage('/characters/tucan.webp');
                return;
            case 'guardian':
                setCharacterImage('/characters/guardian.webp');
                return;
            case 'cori':
                setCharacterImage('/characters/cori.webp');
                return;
            case 'ratasura':
                setCharacterImage('/characters/ratasura.webp');
                return;
            default: 
                break;
        }
    },[])

    return (
        <div className={`character-pin character-pin--${characterName}`} onClick={action}>
            <div className="character-pin__image" >
                <Image
                    className='character-pin__character'
                    src={characterImage} 
                    alt={`Imagen de ${characterName}`}
                    width={100} 
                    height={100} 
                    priority 
                />
            </div>
            <div className='character-pin__pin'>
            </div>
        </div>
    );
};

export default CharacterPin;
