import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPage = () => {
  const t = useTranslations();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      price: t('pricing.plans.free.price'),
      description: t('pricing.plans.free.description'),
      features: t.raw('pricing.plans.free.features'),
      popular: false,
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      price: t('pricing.plans.pro.price'),
      description: t('pricing.plans.pro.description'),
      features: t.raw('pricing.plans.pro.features'),
      popular: true,
    },
    {
      id: 'proplus',
      name: t('pricing.plans.proplus.name'),
      price: t('pricing.plans.proplus.price'),
      description: t('pricing.plans.proplus.description'),
      features: t.raw('pricing.plans.proplus.features'),
      popular: false,
    },
  ];

  return (
    <div>
      <Header />

      {/* Pricing Section */}
      <section className="nv-pricing" id="pricing">
        <div className="nv-pricing-wrapper">
          <div className="nv-pricing-card">
            <div className="nv-pricing-container">
              <div className="nv-pricing-content">
                <h1 className="nv-section-title">{t('pricing.title')}</h1>
                <p className="nv-pricing-subtitle">{t('pricing.subtitle')}</p>

                <div className="nv-pricing-plans">
                  {plans.map(plan => (
                    <div key={plan.id} className="nv-pricing-plan-wrapper">
                      {plan.popular && (
                        <div className="nv-popular-badge">
                          {t('pricing.mostPopular')}
                        </div>
                      )}
                      <div
                        className={`nv-pricing-plan ${selectedPlan === plan.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="nv-plan-header">
                          <h3 className="nv-plan-name">{plan.name}</h3>
                          <div className="nv-plan-price">{plan.price}</div>
                          <p className="nv-plan-description">
                            {plan.description}
                          </p>
                        </div>

                        <button
                          className={`nv-btn-primary nv-plan-cta ${selectedPlan === plan.id ? 'active' : 'disabled'}`}
                          disabled={selectedPlan !== plan.id}
                          onClick={e => {
                            e.stopPropagation();
                            if (selectedPlan === plan.id) {
                              // Handle plan selection/continue action
                              console.log('Continue with plan:', plan.id);
                            }
                          }}
                        >
                          {t('pricing.continue')}
                        </button>

                        <div className="nv-plan-features">
                          <ul>
                            {plan.features.map(
                              (feature: string, index: number) => (
                                <li key={index}>
                                  <span className="nv-feature-check">✓</span>
                                  {feature}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
