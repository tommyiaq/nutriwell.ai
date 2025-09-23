import Head from 'next/head';
import Header from '../components/landing-Header';
import Footer from '../components/landing-Footer';
import BubbleChat from '../components/BubbleChat';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '../contexts/UserContext';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const t = useTranslations();


  // Use authentication check
  const { isAuthenticated } = useUser();

  // Handler for chat button click
  const handleChatClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.location.href = '/signin';
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo02.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/images/logo02.svg" />
        <title>NutriWell</title>
        {/* Font link moved to _document.tsx for best practice */}
      </Head>

      <Header />

      {/* HERO */}
      <section className="hero gradient-x section-wave-bottom">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{t('hero.eyebrow')}</span>
            <span className="eyebrow">{t('hero.eyebrow2')}</span>

            <h1>{t('hero.title')}</h1>
            <p className="lead">{t('hero.description')}</p>
            <div className="trust">
              <span>{t('hero.trust.rating')}</span>
              <span>•</span>
              <span>{t('hero.trust.users')}</span>
              <span>•</span>
              <span>{t('hero.trust.guidelines')}</span>
            </div>
            <div className="hero-cta">
              <Link href="/chat" className="btn btn-primary" onClick={handleChatClick}>
                Inizia ora
              </Link>
              <Link href="#come-funziona" className="btn btn-ghost">
                Scopri come funziona
              </Link>
            </div>
          </div>

          
          <div className="visual" aria-hidden="true">
            <figure className="hero-art">
              {/* Dottore (PNG scontornato) */}
              <img
                src="/images/doctor.png"
                alt="Dr. Francesco Berardino, Biologo nutrizionista"
                className="hero-doctor"
                loading="eager"
                decoding="async"
                // Use Next.js Image for optimization
                // eslint-disable-next-line @next/next/no-img-element
              />
              {/* Smartphone con chat bot */}
              <img
                src="/images/smartphone.png"
                alt="Chat del bot NutriWell su smartphone"
                className="hero-phone"
                loading="eager"
                decoding="async"
                // Use Next.js Image for optimization
                // eslint-disable-next-line @next/next/no-img-element
              />
            </figure>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        <div className="container strip-inner">
          <div className="strip-item">
            <span className="dot" /> Evidenze scientifiche
          </div>
          <div className="strip-item">
            <span className="dot" /> AI trasparente
          </div>
          <div className="strip-item">
            <span className="dot" /> Privacy by design
          </div>
        </div>
      </div>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="section-muted top-fade">
        <div className="container">
          <h2 className="title">Come funziona</h2>
          <p className="sub">Tre semplici passi per iniziare a mangiare meglio.</p>
          <div className="steps">
            <div className="step">
              <div className="icon">📝</div>
              <h3>Raccontaci di te</h3>
              <p>Obiettivi, preferenze, allergie: bastano pochi minuti.</p>
            </div>
            <div className="step">
              <div className="icon">🍽️</div>
              <h3>Ricevi il tuo piano</h3>
              <p>Pasti equilibrati, ricette e lista della spesa intelligente.</p>
            </div>
            <div className="step">
              <div className="icon">📈</div>
              <h3>Impara e migliora</h3>
              <p>Micro-lezioni e feedback settimanale per fare progressi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FUNZIONI */}
      <section id="funzioni">
        <div className="container">
          <h2 className="title">Cosa può fare NutriWell.ai?</h2>
          <p className="sub">Strumenti pratici per le tue scelte di ogni giorno.</p>
          <div className="features">
            {[
              ['📚', 'Educazione nutrizionale', 'Concetti chiave spiegati semplice, basati su evidenze.'],
              ['🔁', 'Sostituzioni alimentari', 'Alternative immediate quando un cibo non va bene.'],
              ['🍽️', 'Pasti equilibrati', 'Esempi pronti da seguire o adattare al volo.'],
              ['🧾', 'Analisi scontrino/frigo', 'Scatta una foto e ricevi insight utili.'],
              ['❤️', 'Supporto condizioni comuni', 'Diabete, colesterolo e altre esigenze diffuse.'],
              ['🔢', 'Calcolo fabbisogno', 'BMR e TDEE accurati per il tuo profilo.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="feature">
                <div className="icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERCHÉ FUNZIONA */}
      <section>
        <div className="container why">
          <div className="bullets">
            <h2 className="title" style={{ textAlign: 'left', marginBottom: 8 }}>
              Perché scegliere NutriWell.ai?

            </h2>
            {[
              ['✅', 'Adesione semplice', 'Analisi nutrizionale e raccomandazioni alimentate dall\'AI.'],
              ['🧠', 'Educazione prima di tutto', 'Guidance basata sulla scienza da fonti verificate.'],
              ['🎯', 'Personalizzazione reale', 'Approccio educativo per una nutrizione sostenibile.'],
              ['🎯', 'Supporto', 'Supporto per varie condizioni di salute e obiettivi.']
            ].map(([i, t, d]) => (
              <div key={t as string} className="bullet">
                <div className="icon">{i}</div>
                <div>
                  <h5>{t}</h5>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="mini-card">
              <strong>Aderenza al piano (+32%)</strong>
              <div className="chart" aria-hidden="true">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
              <div className="quote">
                “La comprensione migliora l’aderenza alle abitudini alimentari.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="container">
          <h2 className="title">Cosa dicono gli utenti</h2>
          <div className="testimonials">
            {[
              ['Sara M.', '4 settimane', '“Mi sento più leggera e capisco finalmente come bilanciare i pasti.”'],
              ['Luca R.', '2 mesi', '“Le sostituzioni sono geniali: mai più panico quando manca un ingrediente.”'],
              ['Elena P.', '1 mese', '“Imparo cose nuove ogni settimana, senza sentirlo come una dieta.”'],
            ].map(([name, time, quote]) => (
              <div key={name as string} className="t-card">
                <div className="t-head">
                  <div className="avatar" />
                  <div>
                    <div className="t-name">{name}</div>
                    <small>{time}</small>
                  </div>
                </div>
                <div className="t-body">{quote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="prezzi">
        <div className="container nv-pricing-wrapper">
          <div className="nv-pricing-card">
            <div className="nv-pricing-container">
              <div className="nv-pricing-content">
                <h2 className="title" style={{ textAlign: 'center', marginBottom: 8 }}>Quanto costa?</h2>
                <p className="sub" style={{ textAlign: 'center', marginBottom: 16 }}>Prova gratis. Cancella quando vuoi.</p>
                <div className="nv-pricing-plans">
                  {[{
                    id: 'free',
                    name: 'Free',
                    price: '€0',
                    description: 'Accesso limitato alle funzioni base.',
                    features: [
                      'Chat con AI nutrizionale',
                      'Consigli generali',
                      'Accesso limitato alle ricette'
                    ],
                    popular: false
                  }, {
                    id: 'pro',
                    name: 'Avanzato',
                    price: '€9/mese',
                    description: 'Tutte le funzioni premium e supporto completo.',
                    features: [
                      'Piano pasti e ricette',
                      'Sostituzioni intelligenti',
                      'Micro-lezioni settimanali',
                      'Supporto condizioni comuni',
                      'Calcolo fabbisogno'
                    ],
                    popular: true
                  }, {
                    id: 'proplus',
                    name: 'Professionale',
                    price: '€39/mese',
                    description: 'Funzioni avanzate e priorità nel supporto.',
                    features: [
                      'Tutte le funzioni Pro',
                      'Crea diete personalizzate',
                      'Supporto prioritario',
                      'Accesso anticipato a nuove feature'
                    ],
                    popular: false
                  }].map(plan => (
                    <div key={plan.id} className="nv-pricing-plan-wrapper">
                      {plan.popular && (
                        <div className="nv-popular-badge">Più scelto</div>
                      )}
                      <div
                        className={`nv-pricing-plan${selectedPlan === plan.id ? ' selected' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="nv-plan-header">
                          <h3 className="nv-plan-name">{plan.name}</h3>
                          <div className="nv-plan-price">{plan.price}</div>
                          <p className="nv-plan-description">{plan.description}</p>
                        </div>
                        <Link 
                          href={`/checkout?plan=${plan.id}`}
                          className={`nv-btn-primary nv-plan-cta${selectedPlan === plan.id ? ' active' : ''}`}
                        >
                          Prosegui
                        </Link>
                        <div className="nv-plan-features">
                          <ul>
                            {plan.features.map((feature, index) => (
                              <li key={index}>
                                <span className="nv-feature-check">✓</span> {feature}
                              </li>
                            ))}
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

      {/* CTA finale */}
      <section className="container">
        <div className="cta">
          <div className="inner">
            <h2>Pronto a iniziare?</h2>
            <p>Nessuna carta richiesta per la prova. Bastano pochi minuti.</p>
            <Link href="/chat" className="btn btn-on-dark">
              Inizia ora
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Bubble Chat */}
      <BubbleChat />
    </>
  );
}
