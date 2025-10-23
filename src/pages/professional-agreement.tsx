import LandingHeader from '../components/landing-Header';
import LandingFooter from '../components/landing-Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';

const ProfessionalAgreement = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();
  
  const [checkboxes, setCheckboxes] = useState({
    ageConsent: false,
    professionalStatus: false,
    protocolAwareness: false,
    termsAcceptance: false
  });
  
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Devi essere autenticato per procedere. Effettua l\'accesso o registrati.');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
      return;
    }

    // Validate all checkboxes are checked
    if (!checkboxes.ageConsent || !checkboxes.professionalStatus || !checkboxes.protocolAwareness || !checkboxes.termsAcceptance) {
      setError('Devi accettare tutte le dichiarazioni per procedere');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Redirect to Stripe checkout for pro plan
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          mode: 'new',
          plan: 'pro',
          user: {
            id: user?.id,
            email: user?.mail
          }
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Errore durante la creazione della sessione di pagamento');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Si è verificato un errore. Riprova più tardi.');
      setIsProcessing(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="nv-auth-page">
        <LandingHeader logoOnly={true} />
        <div className="nv-auth-container">
          <p>Caricamento...</p>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="nv-auth-page">
      <LandingHeader logoOnly={true} />
      <div className="nv-auth-container">
        <div className="nv-auth-box">
          <h2 className="nv-auth-title">Piano Professionista</h2>
          <p className="nv-auth-subtitle">Accettazione Termini e Condizioni per Professionisti</p>

          <form className="nv-auth-form" onSubmit={handleSubmit}>
            {/* Disclaimer Header */}
            <div className="nv-disclaimer-box">
              <p className="nv-disclaimer-text">
                <strong>Disclaimer:</strong> L'accesso alla piattaforma è tecnicamente inibito finché l'utente non accetta volontariamente i Termini e Condizioni d'uso. Il sistema registra tale accettazione come requisito vincolante per l'utilizzo dei servizi offerti.
              </p>
            </div>

            {/* Terms and Conditions Checkboxes */}
            <div className="nv-terms-section">
              <div className="nv-checkbox-group">
                <input
                  type="checkbox"
                  id="ageConsent"
                  name="ageConsent"
                  checked={checkboxes.ageConsent}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="ageConsent" className="nv-checkbox-label">
                  Dichiaro di avere almeno 18 anni e di accedere alla piattaforma in qualità di utente maggiorenne, assumendomi la piena responsabilità dell'utilizzo dei contenuti in conformità con le presenti condizioni.
                </label>
              </div>

              <div className="nv-checkbox-group">
                <input
                  type="checkbox"
                  id="professionalStatus"
                  name="professionalStatus"
                  checked={checkboxes.professionalStatus}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="professionalStatus" className="nv-checkbox-label">
                  Dichiaro, sotto la mia esclusiva responsabilità, di essere un professionista sanitario abilitato (medico, biologo nutrizionista o dietista) e legittimato all'elaborazione di piani nutrizionali ai sensi della normativa vigente. Riconosco che l'accesso al link fornito è strettamente personale e subordinato all'accettazione delle presenti condizioni; la condivisione non autorizzata costituisce violazione dei Termini di utilizzo e può comportare la sospensione del servizio nonché l'assunzione di responsabilità civili e/o penali.
                </label>
              </div>

              <div className="nv-checkbox-group">
                <input
                  type="checkbox"
                  id="protocolAwareness"
                  name="protocolAwareness"
                  checked={checkboxes.protocolAwareness}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="protocolAwareness" className="nv-checkbox-label">
                  Dichiaro di essere consapevole che i protocolli generati da WellAI® costituiscono esclusivamente uno strumento di supporto e che ogni utilizzo clinico o dietetico dovrà essere oggetto di preventiva valutazione da parte di un professionista abilitato, il quale si assume la piena responsabilità delle decisioni prese. L'utente risponde personalmente di eventuali dichiarazioni false o mendaci rese al momento dell'accettazione, le quali potranno comportare responsabilità civili e/o penali.
                </label>
              </div>

              <div className="nv-checkbox-group">
                <input
                  type="checkbox"
                  id="termsAcceptance"
                  name="termsAcceptance"
                  checked={checkboxes.termsAcceptance}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="termsAcceptance" className="nv-checkbox-label">
                  Dichiaro di aver letto, compreso e accettato i{' '}
                  <a 
                    href="/documents/Termini-e-Condizioni-di-utilizzo-App-NutriWellAI-professionisti.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nv-terms-link"
                  >
                    Termini e Condizioni di utilizzo dell'app Nutri WellAI®
                  </a>
                  , come riportati nel documento disponibile. Dichiaro inoltre di aver scaricato, firmato e conservato copia del documento, assumendomi piena responsabilità per l'utilizzo della piattaforma.
                </label>
              </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="nv-disclaimer-box nv-disclaimer-footer">
              <p className="nv-disclaimer-text">
                <strong>Disclaimer:</strong> Nutri WellAI® è uno strumento di supporto alla professione. I protocolli generati sono basati su fonti scientifiche (CREA, SINU, EFSA, PubMed) ma non sostituiscono il parere clinico. L'utilizzo è sotto la responsabilità esclusiva del professionista abilitato.
              </p>
            </div>

            {error && <div className="nv-error-message">{error}</div>}

            <button 
              type="submit" 
              className="nv-btn-primary nv-submit-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Elaborazione...' : 'Accetta e Prosegui'}
            </button>

            <p className="nv-auth-footer">
              Non sei un professionista?{' '}
              <Link href="/#prezzi" className="nv-link">Torna ai piani</Link>
            </p>
          </form>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ProfessionalAgreement;
