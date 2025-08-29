import Header from '../components/Header';
import Footer from '../components/Footer';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="nv-feature-card">
    <div className="nv-feature-icon">{icon}</div>
    <h3 className="nv-feature-title">{title}</h3>
    <p className="nv-feature-description">{description}</p>
  </div>
);

const AutoCarousel = ({ features }: { features: any[] }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = isMobile ? 312 : 352; // card width + gap
    const totalOriginalWidth = cardWidth * features.length;
    const speed = isMobile ? 1.5 : 0.5; // Much faster on mobile

    const animate = () => {
      if (!isPaused && !isDragging && carousel) {
        positionRef.current += speed;
        
        // Reset position when we've scrolled one full set
        if (positionRef.current >= totalOriginalWidth) {
          positionRef.current = 0;
        }
        
        carousel.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isDragging, features.length, isMobile]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setDragStart({
      x: e.pageX,
      scrollLeft: positionRef.current
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX;
    const walk = (x - dragStart.x) * 0.8; // Reduced sensitivity from 2 to 0.8
    const newPosition = dragStart.scrollLeft - walk;
    
    // Handle wrapping
    const cardWidth = isMobile ? 312 : 352;
    const totalOriginalWidth = cardWidth * features.length;
    
    if (newPosition < 0) {
      positionRef.current = totalOriginalWidth + newPosition;
    } else if (newPosition >= totalOriginalWidth) {
      positionRef.current = newPosition - totalOriginalWidth;
    } else {
      positionRef.current = newPosition;
    }
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${positionRef.current}px)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000); // Resume auto-scroll after 1 second
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setDragStart({
      x: e.touches[0].pageX,
      scrollLeft: positionRef.current
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const x = e.touches[0].pageX;
    const walk = (x - dragStart.x) * 0.8; // Reduced sensitivity to match mouse
    const newPosition = dragStart.scrollLeft - walk;
    
    // Handle wrapping
    const cardWidth = isMobile ? 312 : 352;
    const totalOriginalWidth = cardWidth * features.length;
    
    if (newPosition < 0) {
      positionRef.current = totalOriginalWidth + newPosition;
    } else if (newPosition >= totalOriginalWidth) {
      positionRef.current = newPosition - totalOriginalWidth;
    } else {
      positionRef.current = newPosition;
    }
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${positionRef.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000); // Resume auto-scroll after 1 second
  };

  // Just duplicate once for seamless loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <div 
      className="nv-features-carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !isDragging && setIsPaused(false)}
    >
      <div className="nv-features-carousel-wrapper">
        <div 
          className="nv-features-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {duplicatedFeatures.map((feature: any, index: number) => (
            <FeatureCard
              key={`${feature.title}-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const t = useTranslations();
  
  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="nv-hero">
        <div className="nv-hero-card">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="nv-features" id="features">
        <div className="nv-container">
          <h2 className="nv-section-title">{t('features.title')}</h2>
        </div>
        <AutoCarousel features={t.raw('features.items')} />
      </section>

      {/* Product & Disclaimer Combined Section */}
      <section className="nv-product-disclaimer">
        <div className="nv-container">
          <div className="nv-product-disclaimer-wrapper">
            {/* Product Section */}
            <div className="nv-product-content">
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

            {/* Disclaimer Section */}
            <div className="nv-disclaimer-content">
              <h3 className="nv-disclaimer-title">❗ {t('disclaimer.title')}</h3>
              <p className="nv-disclaimer-text">{t('disclaimer.content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA & Footer Combined Section */}
      <section className="nv-cta-footer">
        {/* CTA Section */}
        <div className="nv-cta">
          <div className="nv-container">
            <h2 className="nv-cta-title">🚀 {t('cta.title')}</h2>
            <p className="nv-cta-description">{t('cta.description')}</p>
            <Link href="/chat" className="nv-btn-primary nv-btn-large">
              {t('hero.ctaPrimary')}
            </Link>
          </div>
        </div>

        {/* Footer Section */}
        <Footer />
      </section>
    </div>
  );
};

export default Home;