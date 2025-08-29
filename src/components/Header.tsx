import React, { useState } from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
    const t = useTranslations('header');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    return (
        <header className="nv-header">
            <div className="nv-header-card">
                <div className="nv-container">
                    <Link href="/" className="nv-logo">
                        <h1 className="nv-title">{t('title')}</h1>
                        <span className="nv-tagline">{t('tagline')}</span>
                    </Link>
                
                {/* Desktop Navigation */}
                <nav className="nv-nav nv-nav-desktop">
                    <Link href="#about" className="nv-nav-link">{t('nav.about')}</Link>
                    <Link href="/pricing" className="nv-nav-link">{t('nav.pricing')}</Link>
                    <Link href="/chat" className="nv-nav-link nv-nav-chat">{t('nav.chat')}</Link>
                    <div className="nv-auth-buttons">
                        <Link href="/signin" className="nv-auth-signin">{t('nav.signIn')}</Link>
                        <Link href="/signup" className="nv-auth-signup">{t('nav.signUp')}</Link>
                    </div>
                    <LanguageSwitcher />
                </nav>

                {/* Mobile Navigation */}
                <div className="nv-nav-mobile">
                    <button 
                        className="nv-hamburger" 
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="nv-mobile-menu">
                        <div className="nv-mobile-language">
                            <span className="nv-mobile-language-label">{t('language')}</span>
                            <LanguageSwitcher />
                        </div>
                        <Link href="#about" className="nv-mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                            {t('nav.about')}
                        </Link>
                        <Link href="/pricing" className="nv-mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                            {t('nav.pricing')}
                        </Link>
                        <Link href="/chat" className="nv-mobile-menu-link nv-mobile-chat" onClick={() => setIsMobileMenuOpen(false)}>
                            {t('nav.chat')}
                        </Link>
                        <div className="nv-mobile-auth">
                            <Link href="/signin" className="nv-mobile-auth-signin" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('nav.signIn')}
                            </Link>
                            <Link href="/signup" className="nv-mobile-auth-signup" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('nav.signUp')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </header>
    );
};

export default Header;