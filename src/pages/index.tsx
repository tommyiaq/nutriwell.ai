import Header from '../components/Header';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="nv-feature-card">
    <div className="nv-feature-icon">{icon}</div>
    <h3 className="nv-feature-title">{title}</h3>
    <p className="nv-feature-description">{description}</p>
  </div>
);

const Home = () => {
  const t = useTranslations();
  
  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="nv-hero">
        <div className="nv-hero-container">
          <div className="nv-hero-content">
            <h1 className="nv-hero-title">
              ✨ {t('hero.title')}
            </h1>
            <p className="nv-hero-subtitle">
              {t('hero.subtitle')}
            </p>
            <p className="nv-hero-description">
              {t('hero.description')}
            </p>
            <div className="nv-hero-actions">
              <Link href="/chat" className="nv-btn-primary">
                {t('hero.ctaPrimary')}
              </Link>
              <button className="nv-btn-secondary">
                {t('hero.ctaSecondary')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="nv-features" id="features">
        <div className="nv-container">
          <h2 className="nv-section-title">{t('features.title')}</h2>
          <div className="nv-features-grid">
            {t.raw('features.items').map((feature: any, index: number) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="nv-product">
        <div className="nv-container">
          <h2 className="nv-section-title">💚 {t('product.title')}</h2>
          <p className="nv-product-description">{t('product.description')}</p>
          <div className="nv-benefits-grid">
            {t.raw('product.benefits').map((benefit: string, index: number) => (
              <div key={index} className="nv-benefit-item">
                <span className="nv-check">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="nv-disclaimer">
        <div className="nv-container">
          <h3 className="nv-disclaimer-title">❗ {t('disclaimer.title')}</h3>
          <p className="nv-disclaimer-content">{t('disclaimer.content')}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="nv-cta">
        <div className="nv-container">
          <h2 className="nv-cta-title">🚀 Ready to get started?</h2>
          <p className="nv-cta-description">Transform your nutrition journey with AI-powered guidance tailored to your needs.</p>
          <Link href="/chat" className="nv-btn-primary nv-btn-large">
            {t('hero.ctaPrimary')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;