import React from 'react';
import { 
    Mail, 
    Phone
} from 'lucide-react';
import ClickableItem from '@/components/ClickableItem';
import Image from 'next/image';

const FooterSection = ({dict, params}) => {

    // ----------------------- Email ------------------------------

    const email = dict.footerContactMail;
    const subject = params.lang === 'en' ? "Message sent from arcandinaoficial.org" : "Mensaje enviado desde arcandinaoficial.org";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    return (
        <footer className='footer'>
            <div className='footer__content'>
                <div className='footer__content__group'>
                    <div className='footer__content__list footer__content__list--contact'>
                        <h6>{dict.footerTitle5}</h6>
                        <ul>
                            <li>
                                <ClickableItem className='footer__content__list__item' onClick={'https://whatsapp.com/channel/0029VatT9crGOj9mFN61Bz40'} actionType={'redirect'}>
                                    <img style={{width: '18px', height: '18px'}} src="/socials/whatsapp-icon.svg" alt="Instagram"/>{dict.footerWhatsappText}
                                </ClickableItem>
                            </li>
                        </ul>
                    </div>
                    <div className='footer__content__list'>
                        <h6>{dict.footerTitle1}</h6>
                        <ul>
                            <li><ClickableItem onClick={'AboutUsSection'} actionType={'scrollTo'}>{dict.navbarItem1}</ClickableItem></li>
                            <li><ClickableItem onClick={'ContentSection'} actionType={'scrollTo'}>{dict.navbarButtonHistorias}</ClickableItem></li>
                            <li><ClickableItem onClick={'JournalSection'} actionType={'scrollTo'}>{dict.navbarItem2}</ClickableItem></li>
                            <li><ClickableItem onClick={'ArkSection'} actionType={'scrollTo'}>{dict.navbarItem3}</ClickableItem></li>
                        </ul>
                    </div>
                    <div className='footer__content__list'>
                        <h6>{dict.footerTitle2}</h6>
                        <ul>
                            <li><ClickableItem onClick={`/${params.lang}/arcandina`} actionType={'navigate'}>{dict.arkSection1}</ClickableItem></li>
                            <li><ClickableItem onClick={`/${params.lang}/arcandina`} actionType={'navigate'}>{dict.arkSection2}</ClickableItem></li>
                            <li><ClickableItem onClick={`/${params.lang}/arcandina`} actionType={'navigate'}>{dict.arkSection3}</ClickableItem></li>
                            <li><ClickableItem onClick={`/${params.lang}/arcandina`} actionType={'navigate'}>{dict.arkSection4}</ClickableItem></li>
                        </ul>
                    </div>
                </div>
                <div className='footer__content__group'>
                    <div className='footer__content__list footer__content__list--contact'>
                        <h6>{dict.footerTitle3}</h6>
                        <ul>
                            <li>
                                <a className='footer__content__list--contact__li' href={mailtoLink} target="_blank" rel="noopener noreferrer">
                                    <Mail color={'#faf9f6'} size={18}/>{dict.footerContactMail}
                                </a>
                            </li>
                            <li><Phone color={'#faf9f6'} size={18}/>{dict.footerContactTelephone}</li>
                        </ul>
                    </div>
                    <div className='footer__content__list footer__content__list--socials'>
                        <h6>{dict.footerTitle4}</h6>
                        <ul>
                            <li>
                            <a href="https://www.facebook.com/redarcandina" target="_blank" rel="noopener noreferrer">
                                <img src="/socials/facebook-icon.svg" alt="Facebook" />
                            </a>
                            </li>
                            <li>
                            <a href="https://www.instagram.com/arcandina_fundacion" target="_blank" rel="noopener noreferrer">
                                <img src="/socials/instagram-icon.svg" alt="Instagram" />
                            </a>
                            </li>
                            <li>
                            <a href="https://www.tiktok.com/@arcandina" target="_blank" rel="noopener noreferrer">
                                <img src="/socials/tiktok-icon.svg" alt="TikTok" />
                            </a>
                            </li>
                            <li>
                            <a href="https://www.youtube.com/@arcandinaoficial4280" target="_blank" rel="noopener noreferrer">
                                <img src="/socials/youtube-icon.svg" alt="YouTube" />
                            </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className='footer__hr'></hr>
            <div className='footer__sponsors'>
                <div className='footer__sponsor'>
                    <p>{dict.footerText1}</p>
                    <div className='footer__sponsors__sponsor--arcandina'>
                        <Image
                            src="/mundo-arcandina-logo.png" 
                            alt="Logo mundo arcandina"
                            width={120}
                            height={60} 
                            priority 
                        />
                        <Image
                            src="/fundacion-arcandina-logo.png" 
                            alt="Logo fundación arcandina"
                            width={120} 
                            height={60} 
                            priority
                        />
                    </div>
                </div>
                <div className='footer__sponsor'>
                    <p>{dict.footerText2}</p>
                    <div className='footer__sponsors__sponsor--rotary'>
                        <Image
                            src="/socials/rotary-los-angeles.png" 
                            alt="Logo Rotary Greater Los Angeles"
                            width={120}
                            height={60} 
                            priority 
                        />
                        <Image
                            src="/socials/rotary-de-los-chillos.png" 
                            alt="Logo Rotary De Los Chillos Milenio"
                            width={120} 
                            height={60} 
                            priority
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
