import LandingHeader from '../components/landing-Header';
import LandingFooter from '../components/landing-Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { registerUser, hashPassword } from '../utils/api';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';

const SignUp = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setUser } = useUser();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [checkboxes, setCheckboxes] = useState({
    ageConsent: false,
    informativeContent: false,
    protocolAwareness: false,
    termsAcceptance: false,
    dietaryDisclaimer: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    setSuccess('');
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate all checkboxes are checked
    if (!checkboxes.ageConsent || !checkboxes.informativeContent || !checkboxes.protocolAwareness || !checkboxes.termsAcceptance || !checkboxes.dietaryDisclaimer) {
      setError('You must accept all terms and conditions to register');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Hash the password before sending
      const hashedPassword = await hashPassword(formData.password);
      
      // Prepare registration data exactly as the API expects
      const registerData = {
        mail: formData.email,
        pass: hashedPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        language: 'en' // Default to English
      };
      
      // Call the registration API
      const response = await registerUser(registerData);
      
      if (response.status === 'ok') {
        // Extract user data - try different possible structures
        let userData = null;
        
        if (response.data?.user) {
          // Standard structure: response.data.user
          userData = response.data.user;
        } else {
          // Cast to any to bypass TypeScript checking
          const dataAny = response.data as any;
          
          if (dataAny?.firstName || dataAny?.id || dataAny?.mail) {
            // Direct structure: user data is directly in response.data
            userData = dataAny;
          } else {
            // Try to find user data in any property of response.data
            for (const key in dataAny) {
              const value = dataAny[key];
              if (value && typeof value === 'object' && (value.firstName || value.id || value.mail)) {
                userData = value;
                break;
              }
            }
          }
        }
        
        // Set the user in context
        if (userData) {
          setUser(userData as any);
        }
        
        setSuccess('Registration successful! You are now logged in.');
        // Redirect to chat page after successful registration
        setTimeout(() => {
          router.push('/chat');
        }, 2000);
      } else {
        console.error('Registration error:', response.error); // Debug log
        setError(response.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nv-auth-page">
      <LandingHeader />

      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">{t('signUp.title')}</h1>
          <p className="nv-auth-subtitle">{t('signUp.subtitle')}</p>

          <form className="nv-auth-form" onSubmit={handleSubmit}>
            <div className="nv-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="email">{t('signUp.email')}</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder={t('signUp.emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="password">{t('signUp.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={t('signUp.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="confirmPassword">{t('signUp.confirmPassword')}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t('signUp.confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
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
                  id="informativeContent"
                  name="informativeContent"
                  checked={checkboxes.informativeContent}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="informativeContent" className="nv-checkbox-label">
                  Dichiaro di aver compreso che i contenuti generati dalla piattaforma Nutri WellAI® hanno finalità esclusivamente informative e non sostituiscono in alcun modo il parere e la valutazione di un professionista sanitario abilitato. L'accesso al link è strettamente personale e subordinato all'accettazione delle presenti condizioni; la condivisione non autorizzata viola i Termini di utilizzo e può comportare la sospensione del servizio, nonché eventuali responsabilità civili e/o penali.
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
                  Dichiaro di essere consapevole che i contenuti generati da WellAI® costituiscono esclusivamente uno strumento informativo e di supporto, e che ogni eventuale applicazione in ambito clinico o dietetico richiede la valutazione e supervisione di un professionista sanitario abilitato. Riconosco che eventuali dichiarazioni false o mendaci rese al momento dell'accettazione delle presenti condizioni possono comportare responsabilità civili e/o penali a mio carico.
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
                    href="/documents/Termini-e-Condizioni-di-utilizzo-App-NutriWellAI-per-utenti-1.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nv-terms-link"
                  >
                    Termini e Condizioni di utilizzo dell'app Nutri WellAI®
                  </a>
                  , come riportati nel documento "Termini e Condizioni di utilizzo app Nutri WellAI® per utenti", disponibile nella sezione sottostante. Dichiaro di aver preso visione, scaricato e conservato copia del documento ai fini della consultazione, assumendomi ogni responsabilità in merito al suo utilizzo, e mi assumo la piena responsabilità per l'utilizzo della piattaforma, consapevole che ogni uso improprio può comportare conseguenze di natura civile e/o penale.
                </label>
              </div>

              <div className="nv-checkbox-group">
                <input
                  type="checkbox"
                  id="dietaryDisclaimer"
                  name="dietaryDisclaimer"
                  checked={checkboxes.dietaryDisclaimer}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="dietaryDisclaimer" className="nv-checkbox-label">
                  Dichiaro di essere consapevole che le risposte e i contenuti forniti dalla piattaforma Nutri WellAI® non costituiscono in alcun caso un piano dietetico personalizzato, nemmeno qualora riportino valori calorici o indicazioni relative a pasti o menù. Tali contenuti hanno esclusivamente finalità informative e generiche e non sostituiscono in alcun modo il parere, la diagnosi o la prescrizione di un professionista sanitario abilitato. L'eventuale utilizzo improprio a fini dietetici, clinici o terapeutici avviene sotto la piena ed esclusiva responsabilità dell'utente, che solleva sin d'ora il titolare della piattaforma da ogni responsabilità civile e/o penale.
                </label>
              </div>
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
                {success}
              </div>
            )}

            <button type="submit" className="nv-auth-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : t('signUp.signUpButton')}
            </button>
          </form>

          <p className="nv-auth-link">
            {t('signUp.hasAccount')}{' '}
            <Link href="/signin">{t('signUp.signInLink')}</Link>
          </p>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default SignUp;
