// Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Settings, Shield, Palette } from 'lucide-react';

export default function Profile() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
    // Broadcast custom event so the Navbar toggle instantly syncs its state
    window.dispatchEvent(new Event('themeChange'));
  };

  // Sync state if storage updates elsewhere
  useEffect(() => {
    const handleEvent = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };
    window.addEventListener('themeChange', handleEvent);
    return () => window.removeEventListener('themeChange', handleEvent);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <h1 className="page-title">User Account</h1>
        <p className="page-subtitle">Configure your personal preferences, details, and dashboard look and feel.</p>
      </div>

      <div className="grid-2">
        {/* User Details Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <User size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Personal Information</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifycontent: 'center', display: 'flex', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 'bold', border: '3px solid var(--border-color)', boxShadow: 'var(--shadow-glow)' }}>
              HR
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Sarah Jenkins</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>sarah.j@company.com</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Designation:</span>
              <strong style={{ color: 'var(--text-primary)' }}>HR Director</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Human Resources</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Privilege Level:</span>
              <span className="badge success" style={{ fontWeight: 'bold' }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Dashboard Customization / Background Color Theme */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <Palette size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Appearance Preferences</h3>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Customize the background color of your dashboard workspace to match your visual comfort. Choose between a clean white background or a premium dark workspace.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            {/* Dark Theme (Black) Choice */}
            <div 
              onClick={() => handleThemeChange('dark')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                backgroundColor: 'rgba(11, 15, 25, 0.5)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: '#fff', fontSize: '14px' }}>Black Background (Dark Mode)</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Reduced eye strain for night views</span>
              </div>
              <input 
                type="radio" 
                name="theme" 
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </div>

            {/* Light Theme (White) Choice */}
            <div 
              onClick={() => handleThemeChange('light')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: '#0f172a', fontSize: '14px' }}>White Background (Light Mode)</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>High contrast and visibility for day views</span>
              </div>
              <input 
                type="radio" 
                name="theme" 
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
