import React from 'react';
import {useRouter} from 'next/router';
import {useTranslations} from 'next-intl';

const LanguageSwitcher: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('header');
    
    const switchLanguage = (locale: string) => {
        router.push(router.asPath, router.asPath, { locale });
    };
    
    return (
        <div className="nv-language-switcher">
            <button 
                onClick={() => switchLanguage('en')}
                className={`nv-lang-btn ${router.locale === 'en' ? 'active' : ''}`}
            >
                EN
            </button>
            <button 
                onClick={() => switchLanguage('it')}
                className={`nv-lang-btn ${router.locale === 'it' ? 'active' : ''}`}
            >
                IT
            </button>
        </div>
    );
};

export default LanguageSwitcher;
