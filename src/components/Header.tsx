import React from 'react';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
    const t = useTranslations('header');
    
    return (
        <header className="nv-header">
            <div className="nv-container">
                <div className="nv-logo">
                    <h1 className="nv-title">{t('title')}</h1>
                    <span className="nv-tagline">{t('tagline')}</span>
                </div>
                <nav className="nv-nav">
                    <a href="#features" className="nv-nav-link">{t('nav.features')}</a>
                    <a href="#about" className="nv-nav-link">{t('nav.about')}</a>
                    <a href="#pricing" className="nv-nav-link">{t('nav.pricing')}</a>
                    <button className="nv-cta-button">{t('nav.getStarted')}</button>
                    <LanguageSwitcher />
                </nav>
            </div>
        </header>
    );
};

export default Header;