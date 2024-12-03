'use client'

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import { useRouter, usePathname } from 'next/navigation';

const CharacterMessage = ({characterName, dict, visible}) => {

    const router = useRouter();
    const currentPath = usePathname();
    const [characterImage, setCharacterImage] = useState('/characters/cori.webp');
    const [characterInfo, setCharacterInfo] = useState({});

    useEffect(()=>{
        switch(characterName){
            case 'jagui':
                setCharacterImage('/characters/jagui.webp');
                setCharacterInfo({
                    span: dict.proyectosYTalleres,
                    h6: 'Jagüi',
                    p: dict.landingPage.jaguiDescription
                })
                return;
            case 'antonella':
                setCharacterImage('/characters/antonella.webp');
                setCharacterInfo({
                    span: dict.visitArcandina,
                    h6: 'Antonella',
                    p: dict.landingPage.antonellaDescription
                })
                return;
            case 'tucan':
                setCharacterImage('/characters/tucan2.webp');
                setCharacterInfo({
                    span: dict.rinconLectura,
                    h6: 'Tucán',
                    p: dict.landingPage.tucanDescription
                })
                return;
            case 'guardian':
                setCharacterImage('/characters/guardian.webp');
                setCharacterInfo({
                    span: dict.zonaVideos,
                    h6: 'Guardián Verde',
                    p: dict.landingPage.guardianDescription
                })
                return;
            case 'cori':
                setCharacterImage('/characters/cori.webp');
                setCharacterInfo({
                    span: dict.podcasts,
                    h6: 'Cori',
                    p: dict.landingPage.coriDescription
                })
                return;
            case 'ratasura':
                setCharacterImage('/characters/ratasura.webp');
                return;
            default: 
                break;
        }
    },[])

    const handleClick = () => {
        router.push(`${currentPath}/arcandina`);
    };

    return (
        <div className={`character-message character-message--${characterName} ${visible && 'character-message-visible'}`}>
            <div className="character-message__image" >
                <Image
                    className='character-message__character'
                    src={characterImage} 
                    alt={`Imagen de ${characterName}`}
                    width={100} 
                    height={100} 
                    priority 
                />
            </div>
            <div onClick={handleClick} className='character-message__info'>
                <div className={`character-message__info__border character-message__info__border--${characterName}`}>
                </div>
                <div className={`character-message__info__text character-message__info__text--${characterName}`}>
                    <span>{characterInfo?.span || ''}</span>
                    <h6>{characterInfo?.h6 || ''}</h6>
                    <p>{characterInfo?.p || ''}</p>
                </div>
            </div>
        </div>
    );
};

export default CharacterMessage;
