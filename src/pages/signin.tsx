import Header from '../components/Header';
import {useTranslations} from 'next-intl';

const SignIn = () => {
  const t = useTranslations();
  
  return (
    <div className="nv-auth-page">
      <Header />
      
      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">Sign In to NutriWell.ai</h1>
          <p className="nv-auth-subtitle">Welcome back! Please sign in to your account.</p>
          
          <form className="nv-auth-form">
            <div className="nv-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            
            <div className="nv-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            
            <button type="submit" className="nv-auth-button">
              Sign In
            </button>
          </form>
          
          <p className="nv-auth-link">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
