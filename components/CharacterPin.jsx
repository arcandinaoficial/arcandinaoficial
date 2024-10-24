'use client'

import Image from 'next/image';
import React, {useEffect, useState} from 'react';

const CharacterPin = ({characterName}) => {

    const [characterImage, setCharacterImage] = useState('/characters/cori.png');

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
        <div className={`character-pin character-pin--${characterName}`}>
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
