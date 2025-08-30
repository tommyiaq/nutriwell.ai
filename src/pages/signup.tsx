import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SignUp = () => {
  const t = useTranslations('auth');

  return (
    <div className="nv-auth-page">
      <Header />

      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">{t('signUp.title')}</h1>
          <p className="nv-auth-subtitle">{t('signUp.subtitle')}</p>

          <form className="nv-auth-form">
            <div className="nv-form-group">
              <label htmlFor="fullname">{t('signUp.name')}</label>
              <input
                type="text"
                id="fullname"
                placeholder={t('signUp.namePlaceholder')}
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="email">{t('signUp.email')}</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>

            <div className="nv-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="nv-auth-button">
              {t('signUp.signUpButton')}
            </button>
          </form>

          <p className="nv-auth-link">
            {t('signUp.hasAccount')}{' '}
            <Link href="/signin">{t('signUp.signInLink')}</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
