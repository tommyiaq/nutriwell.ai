import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SignIn = () => {
  const t = useTranslations('auth');

  return (
    <div className="nv-auth-page">
      <Header />

      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">{t('signIn.title')}</h1>
          <p className="nv-auth-subtitle">{t('signIn.subtitle')}</p>

          <form className="nv-auth-form">
            <div className="nv-form-group">
              <label htmlFor="email">{t('signIn.email')}</label>
              <input
                type="email"
                id="email"
                placeholder={t('signIn.emailPlaceholder')}
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="password">{t('signIn.password')}</label>
              <input
                type="password"
                id="password"
                placeholder={t('signIn.passwordPlaceholder')}
              />
            </div>

            <button type="submit" className="nv-auth-button">
              {t('signIn.signInButton')}
            </button>
          </form>

          <p className="nv-auth-link">
            {t('signIn.noAccount')}{' '}
            <Link href="/signup">{t('signIn.signUpLink')}</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
