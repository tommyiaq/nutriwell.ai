import LandingHeader from '../components/landing-Header';
import LandingFooter from '../components/landing-Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { loginUser, hashPassword } from '../utils/api';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';

const SignIn = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setUser } = useUser();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Hash the password before sending
      const hashedPassword = await hashPassword(formData.password);
      
      // Prepare login data exactly as the API expects
      const loginData = {
        mail: formData.email,
        pass: hashedPassword
      };
      
      console.log('Login attempt:', { mail: loginData.mail }); // Debug log (don't log password)
      
      // Call the login API
      const response = await loginUser(loginData);
      
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
        
        // Redirect to chat page after successful login
        router.push('/chat');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nv-auth-page">
      <LandingHeader />

      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">{t('signIn.title')}</h1>
          <p className="nv-auth-subtitle">{t('signIn.subtitle')}</p>

          <form className="nv-auth-form" onSubmit={handleSubmit}>
            <div className="nv-form-group">
              <label htmlFor="email">{t('signIn.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t('signIn.emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="nv-form-group">
              <label htmlFor="password">{t('signIn.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={t('signIn.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" className="nv-auth-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : t('signIn.signInButton')}
            </button>
          </form>

          <p className="nv-auth-link">
            {t('signIn.noAccount')}{' '}
            <Link href="/signup">{t('signIn.signUpLink')}</Link>
          </p>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default SignIn;
