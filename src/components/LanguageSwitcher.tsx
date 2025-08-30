import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const FlagUS = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" className="nv-flag-icon">
      <rect width="20" height="15" fill="#B22234" />
      <rect width="20" height="1.15" y="1.15" fill="white" />
      <rect width="20" height="1.15" y="3.46" fill="white" />
      <rect width="20" height="1.15" y="5.77" fill="white" />
      <rect width="20" height="1.15" y="8.08" fill="white" />
      <rect width="20" height="1.15" y="10.38" fill="white" />
      <rect width="20" height="1.15" y="12.69" fill="white" />
      <rect width="8" height="7.5" fill="#3C3B6E" />
    </svg>
  );

  const FlagIT = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" className="nv-flag-icon">
      <rect width="6.67" height="15" fill="#009246" />
      <rect x="6.67" width="6.67" height="15" fill="white" />
      <rect x="13.33" width="6.67" height="15" fill="#CE2B37" />
    </svg>
  );

  const languages = [
    { code: 'en', name: 'English', flag: <FlagUS /> },
    { code: 'it', name: 'Italiano', flag: <FlagIT /> },
  ];

  const currentLang =
    languages.find(lang => lang.code === router.locale) || languages[0];

  const switchLanguage = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale });
    setIsOpen(false);
  };

  return (
    <div className="nv-language-dropdown">
      <button className="nv-lang-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="nv-flag">{currentLang?.flag}</span>
        <span className="nv-lang-code">{currentLang?.code.toUpperCase()}</span>
        <span className={`nv-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="nv-lang-options">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`nv-lang-option ${router.locale === lang.code ? 'active' : ''}`}
              onClick={() => switchLanguage(lang.code)}
            >
              <span className="nv-flag">{lang.flag}</span>
              <span className="nv-lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
