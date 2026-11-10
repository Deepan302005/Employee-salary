// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  // Initialize theme state from localStorage
  const [isLightMode, setIsLightMode] = useState(
    localStorage.getItem('theme') === 'light'
  );

  // Sync theme changes with body classList and localStorage
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  // Sync state if storage updates elsewhere (e.g. from the Profile settings)
  useEffect(() => {
    const handleEvent = () => {
      setIsLightMode(localStorage.getItem('theme') === 'light');
    };
    window.addEventListener('themeChange', handleEvent);
    return () => window.removeEventListener('themeChange', handleEvent);
  }, []);
  
  // Resolve page header titles based on pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/employees':
        return 'Employee Database';
      case '/analytics':
        return 'Salary Analytics Insights';
      case '/profile':
        return 'User Profile Settings';
      default:
        return 'Salary Dashboard';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Menu">
          <Menu size={22} />
        </button>
        <h2 className="navbar-title-text" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600 }}>
          {getPageTitle()}
        </h2>
      </div>

      <div className="navbar-right">
        {/* Dark/Light Toggle Switch */}
        <button 
          onClick={() => setIsLightMode(!isLightMode)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px', 
            borderRadius: '50%',
            transition: 'background-color var(--transition-fast)' 
          }}
          title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label="Toggle Theme"
        >
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Clickable Profile Avatar to navigate to /profile page */}
        <Link 
          to="/profile" 
          className="nav-user" 
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          title="User Profile Preferences"
        >
          <div className="user-avatar" style={{ cursor: 'pointer', border: '2px solid var(--accent-primary)', transition: 'border-color var(--transition-fast)' }}>
            <span>HR</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
