import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  logoOnly?: boolean;
}

export default function Header({ logoOnly = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  /**
   * Toggle mobile menu visibility
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
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="NutriWell Home">
          {/* Logo logo01 sia su desktop che mobile */}
          <img
            src="/images/logo01.svg"
            alt="NutriWell"
            className="logo-img"
            height={28}
          />
        </Link>

        {!logoOnly && (
          <>
            {/* Desktop Navigation */}
            <nav className="nav hide-mobile" aria-label="Principale">
              <Link href="#funzioni">Funzioni</Link>
              <Link href="#come-funziona">Come funziona</Link>
              <Link href="#prezzi">Prezzi</Link>
              <Link href="/chat" className="btn btn-primary">Chat</Link>
              {isAuthenticated ? (
                <>
                  <span style={{ color: 'var(--nv-text-light)', fontSize: '0.875rem', fontWeight: '500' }}>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button 
                    onClick={logout}
                    className="btn btn-ghost"
                    style={{ color: '#dc3545', borderColor: '#dc3545' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="btn btn-ghost">Accedi</Link>
                  <Link href="/signup" className="btn btn-ghost">Registrati</Link>
                </>
              )}
              <span style={{marginLeft: 'auto', display: 'inline-flex', alignItems: 'center'}}>
                <LanguageSwitcher />
              </span>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="nav-mobile show-mobile">
          <button
            className="hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Language selector for mobile */}
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="mobile-menu-link" style={{margin: 0}}>Lingua:</span><LanguageSwitcher />
            </div>
            {/* Navigation links */}
            <Link
              href="#funzioni"
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              Funzioni
            </Link>
            <Link
              href="#come-funziona"
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              Come funziona
            </Link>
            <Link
              href="#prezzi"
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              Prezzi
            </Link>
            <Link
              href="/chat"
              className="btn btn-primary mobile-chat-full"
              style={{display: 'block', width: 'calc(100% - 32px)', margin: '16px auto', textAlign: 'center', padding: '12px'}}
              onClick={closeMobileMenu}
            >
              Chat
            </Link>

            {/* Authentication buttons for mobile */}
            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <div style={{ 
                    color: 'var(--nv-text-light)', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '0.5rem'
                  }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="mobile-auth-signin"
                    style={{ 
                      background: 'rgba(220, 53, 69, 0.1)',
                      color: '#dc3545',
                      borderColor: '#dc3545'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="mobile-auth-signin"
                    onClick={closeMobileMenu}
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/signup"
                    className="mobile-auth-signin"
                    onClick={closeMobileMenu}
                  >
                    Registrati
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </header>
  );
}
