import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="nv-header">
            <div className="nv-container">
                <div className="nv-logo">
                    <h1 className="nv-title">nutriwell.ai</h1>
                    <span className="nv-tagline">Smart Nutrition, Powered by AI</span>
                </div>
                <nav className="nv-nav">
                    <a href="#features" className="nv-nav-link">Features</a>
                    <a href="#about" className="nv-nav-link">About</a>
                    <a href="#pricing" className="nv-nav-link">Pricing</a>
                    <button className="nv-cta-button">Get Started</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;