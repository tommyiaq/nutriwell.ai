import Header from '../components/Header';
import Footer from '../components/Footer';
import {useTranslations} from 'next-intl';

const SignUp = () => {
  const t = useTranslations();
  
  return (
    <div className="nv-auth-page">
      <Header />
      
      <div className="nv-auth-container">
        <div className="nv-auth-card">
          <h1 className="nv-auth-title">Join NutriWell.ai</h1>
          <p className="nv-auth-subtitle">Create your account and start your nutrition journey today.</p>
          
          <form className="nv-auth-form">
            <div className="nv-form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" placeholder="Enter your full name" />
            </div>
            
            <div className="nv-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            
            <div className="nv-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Create a password" />
            </div>
            
            <div className="nv-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Confirm your password" />
            </div>
            
            <button type="submit" className="nv-auth-button">
              Sign Up
            </button>
          </form>
          
          <p className="nv-auth-link">
            Already have an account? <a href="/signin">Sign in here</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
