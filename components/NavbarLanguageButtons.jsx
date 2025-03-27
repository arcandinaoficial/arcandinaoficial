'use client'

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';

const NavbarLanguageButtons = ({ dict, params }) => {

    // ------------- Setup ------------------------

    const currentPath = usePathname();
    const router = useRouter();

    // ---------------- Functions ----------------------

    const handleLanguageChange = (lang) => {
        let newLang = lang || (params.lang === 'en' ? 'es' : 'en');
        const newPath = currentPath.replace(`/${params.lang}`, `/${newLang}`);
    
        router.push(newPath, { scroll: false });
    };

    return (
        <nav className='navbar__buttons--language'>
            <button
                className='navbar__buttons__switch__text'
                data-pr-tooltip={dict.changeToSpanish}
                data-pr-position="bottom"
                id="es-msg"
                data-pr-classname="tooltip"
                data-pr-showdelay={500}
                onClick={() => handleLanguageChange('es')}>
                <img alt="Spannish Flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-es`} style={{ width: '30px' }} />
            </button>
            <button
                className='navbar__buttons__switch__text'
                data-pr-tooltip={dict.changeToEnglish}
                data-pr-position="bottom"
                id="en-msg"
                data-pr-classname="tooltip"
                data-pr-showdelay={500}
                onClick={() => handleLanguageChange('en')}>
                <img alt="United States Flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-us`} style={{ width: '30px' }} />
            </button>
        </nav>
    );
};

export default NavbarLanguageButtons;
