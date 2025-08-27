import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="nv-header">
            <h1 className="nv-title">nutrivell.ai</h1>
            <nav>
                <ul className="nv-nav">
                    <li><a href="/">Home</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;