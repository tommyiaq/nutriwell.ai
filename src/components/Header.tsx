import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Header component with responsive navigation and mobile menu
 * Features:
 * - Responsive design with desktop/mobile navigation
 * - Internationalization support
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Smooth animations and hover effects
 */
interface HeaderProps {
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ sticky = true }) => {
  const t = useTranslations('header');
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Get the active class for navigation links
   */
  const getNavLinkClass = (href: string) => {
    const isActive = router.pathname === href;
    return `nv-nav-link${isActive ? ' nv-nav-active' : ''}`;
  };

  /**
   * Get the active class for mobile navigation links
   */
  const getMobileNavLinkClass = (href: string) => {
    const isActive = router.pathname === href;
    return `nv-mobile-menu-link${isActive ? ' nv-mobile-menu-active' : ''}`;
  };

  /**
   * Toggle mobile menu visibility
   * Uses useCallback to prevent unnecessary re-renders
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Close mobile menu when navigation link is clicked
   */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className={`nv-header${!sticky ? ' nv-header-static' : ''}`}> 
      <div className="nv-header-card">
        <div className="nv-container">
          {/* Logo and Brand */}
          <Link href="/" className="nv-logo" aria-label="NutriWell.ai Homepage">
            <h1 className="nv-title">{t('title')}</h1>
            <span className="nv-tagline">{t('tagline')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="nv-nav nv-nav-desktop"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Left side navigation links */}
            <div className="nv-nav-links">
              <Link href="/" className={getNavLinkClass('/')}>
                {t('nav.about')}
              </Link>
              <Link href="/pricing" className={getNavLinkClass('/pricing')}>
                {t('nav.pricing')}
              </Link>
              <Link href="/chat" className={getNavLinkClass('/chat')}>
                {t('nav.chat')}
              </Link>
            </div>

            {/* Right side auth and language */}
            <div className="nv-nav-right">
              {/* Authentication buttons */}
              <div className="nv-auth-buttons">
                <Link href="/signin" className={`nv-auth-signin${router.pathname === '/signin' ? ' nv-auth-active' : ''}`}>
                  {t('nav.signIn')}
                </Link>
                <Link href="/signup" className={`nv-auth-signup${router.pathname === '/signup' ? ' nv-auth-active' : ''}`}>
                  {t('nav.signUp')}
                </Link>
              </div>

              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="nv-nav-mobile">
            <button
              className="nv-hamburger"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}
              />
              <span
                className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}
              />
              <span
                className={`nv-hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}
              />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div
              className="nv-mobile-menu"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Language selector for mobile */}
              <div className="nv-mobile-language">
                <span className="nv-mobile-language-label">
                  {t('language')}
                </span>
                <LanguageSwitcher />
              </div>

              {/* Navigation links */}
              <Link
                href="/"
                className={getMobileNavLinkClass('/')}
                onClick={closeMobileMenu}
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/pricing"
                className={getMobileNavLinkClass('/pricing')}
                onClick={closeMobileMenu}
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href="/chat"
                className={getMobileNavLinkClass('/chat')}
                onClick={closeMobileMenu}
              >
                {t('nav.chat')}
              </Link>

              {/* Authentication buttons for mobile */}
              <div className="nv-mobile-auth">
                <Link
                  href="/signin"
                  className="nv-mobile-auth-signin"
                  onClick={closeMobileMenu}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href="/signup"
                  className="nv-mobile-auth-signup"
                  onClick={closeMobileMenu}
                >
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
