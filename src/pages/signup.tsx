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
